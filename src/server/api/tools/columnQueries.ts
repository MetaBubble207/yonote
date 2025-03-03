import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { and, desc, eq, like, sql, asc } from "drizzle-orm";
import { column, DetailColumnCard, order, post, postLike, postRead, user } from "@/server/db/schema";
import type * as schema from "../../db/schema";
import { getOneUser } from "./userQueries";

export async function getColumnBasicInfo(
    db: PostgresJsDatabase<typeof schema>,
    columnId: string,
    search?: string,
    isDesc?: boolean,
    tag?: string
) {
    const postConditions = [
        eq(post.columnId, columnId),
        eq(post.status, true),
    ];

    // 添加搜索条件
    if (search) {
        postConditions.push(
            sql`(${post.name} ILIKE ${`%${search}%`} OR ${post.content} ILIKE ${`%${search}%`})`
        );
    }

    if (tag && !['all', 'top', 'free'].includes(tag)) {
        postConditions.push(
            like(post.tag, `%${tag}%`)
        );
    }
    if (tag === 'top') {
        postConditions.push(
            eq(post.isTop, true)
        );
    }
    if (tag === 'free') {
        postConditions.push(
            eq(post.isFree, true)
        );
    }

    const [columnData, subscription, posts] = await Promise.all([
        db.query.column.findFirst({
            where: eq(column.id, columnId),
            columns: {
                id: true,
                userId: true,
            },
        }),
        db.select({ id: order.id })
            .from(order)
            .where(eq(order.columnId, columnId)),
        db.select({
            id: post.id,
            name: post.name,
            content: post.content,
            isTop: post.isTop,
            isFree: post.isFree,
            tag: post.tag,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            columnId: post.columnId,
            chapter: post.chapter,
        })
            .from(post)
            .where(and(...postConditions))
            .orderBy(
                desc(post.isTop),
                isDesc ? desc(post.chapter) : post.chapter
            ),
    ]);

    if (!columnData) {
        throw new Error("专栏不存在");
    }

    return { columnData, subscription, posts };
}

export async function getUserData(db: PostgresJsDatabase<typeof schema>, userId: string) {
    const userData = await db.query.user.findFirst({
        where: eq(user.id, userId),
        columns: {
            id: true,
            name: true,
            idType: true,
            avatar: true,
        },
    });

    if (!userData) {
        throw new Error("用户不存在");
    }

    return userData;
}

export async function getPostStats(
    db: PostgresJsDatabase<typeof schema>,
    postId: number
) {
    const [likes, reads] = await Promise.all([
        db.select({ id: postLike.id })
            .from(postLike)
            .where(and(eq(postLike.postId, postId), eq(postLike.isLike, true))),
        db.select({
            totalReads: sql<number>`sum(${postRead.readCount})`
        })
            .from(postRead)
            .where(eq(postRead.postId, postId))
    ]);

    return {
        likeCount: likes.length,
        readCount: reads[0]?.totalReads ?? 0
    };
}


export const getDetailColumnCard = async (
    ctx: { headers: Headers; db: PostgresJsDatabase<typeof schema> },
    columnId: string,
): Promise<DetailColumnCard | null> => {
    const { db } = ctx;
    const columnData = await db.query.column.findFirst({
        where: eq(column.id, columnId),
    });

    if (!columnData) {
        return null;
    }
    // 获取专栏下的所有帖子
    const posts = await db
        .select()
        .from(post)
        .where(and(eq(post.columnId, columnId), eq(post.status, true)))
        .orderBy(asc(post.chapter));
    // 并行获取所有文章的统计数据并累加
    const postsWithStats = await Promise.all(
        posts.map(async (post) => await getPostStats(db, post.id))
    );

    // 计算总阅读量和点赞量
    const { readCount, likeCount } = postsWithStats.reduce(
        (acc, curr) => ({
            readCount: Number(acc.readCount) + Number(curr.readCount ?? 0),
            likeCount: Number(acc.likeCount) + Number(curr.likeCount ?? 0),
        }),
        { readCount: 0, likeCount: 0 }
    );

    // 获取专栏订阅量
    const subscriptionCount = (
        await db.select().from(order).where(eq(order.columnId, columnId))
    ).length;
    // 获取帖子数量
    const postCount = (
        await db.select().from(post).where(eq(post.columnId, columnId))
    ).length;
    // 获取作者基本信息
    const userData = await getOneUser(ctx.db, columnData.userId);
    let detailColumnCard: DetailColumnCard = {
        id: "",
        name: "",
        distributorship: false,
        introduce: null,
        type: "",
        cover: null,
        description: null,
        userId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: "",
        isFree: false,
        isTop: false,
        likeCount: 0,
        readCount: 0,
        subscriptionCount: 0,
        postCount: 0,
        userName: "",
        idType: 0,
    };
    if (!userData) return null;
    Object.assign(detailColumnCard, {
        ...columnData,
        readCount,
        likeCount,
        subscriptionCount,
        postCount,
        userId: userData.id,
        userName: userData.name,
        avatar: userData.avatar,
        idType: userData.idType,
    });
    return detailColumnCard;
};

// 检查文章更新状态的工具函数
export async function checkUnreadPosts(
    db: PostgresJsDatabase<typeof schema>,
    posts: { id: number; columnId: string; updatedAt: Date }[],
    userId: string,
  ) {
    if (!posts.length) return new Set<string>();
  
    // 批量获取阅读记录
    const readRecords = await db
      .select()
      .from(postRead)
      .where(and(
        eq(postRead.userId, userId),
        sql`${postRead.postId} IN ${posts.map(p => p.id)}`
      ));
    
    const readMap = new Map(readRecords.map(r => [r.postId, r]));
    const updatedColumnIds = new Set<string>();
  
    // 检查每篇文章的更新状态
    for (const post of posts) {
      const readRecord = readMap.get(post.id);
      const needsUpdate = !readRecord || readRecord.updatedAt < post.updatedAt;
      if (needsUpdate) {
        updatedColumnIds.add(post.columnId);
      }
    }
  
    return updatedColumnIds;
  }
