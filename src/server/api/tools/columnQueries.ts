import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { and, desc, eq, sql } from "drizzle-orm";
import { column, order, post, postLike, postRead, user } from "@/server/db/schema";
import type * as schema from "../../db/schema";

export async function getColumnBasicInfo(
    db: PostgresJsDatabase<typeof schema>, 
    columnId: string,
    search?: string,
    isDesc?: boolean
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
      .where(eq(postLike.postId, postId)),
    db.select({ id: postRead.id })
      .from(postRead)
      .where(eq(postRead.postId, postId)),
  ]);

  return {
    likeCount: likes.length,
    readCount: reads.length,
  };
}