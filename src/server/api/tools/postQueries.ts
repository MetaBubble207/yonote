import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "../../db/schema";
import { column, post, user } from "../../db/schema";
import { and, eq, sql } from "drizzle-orm";

export const getDetailPost = async (db: PostgresJsDatabase<typeof schema>, columnId: string, chapter: number) => {

    if (chapter < 1) {
        return null;
    }

    // 获取最大章节数
    const maxChapter = await db.query.post.findFirst({
        where: eq(post.columnId, columnId),
        orderBy: (post, { desc }) => [desc(post.chapter)],
        columns: { chapter: true }
    });

    if (!maxChapter) {
        throw new Error("Column has no posts");
    }

    // 使用联表查询一次性获取所有需要的数据
    const result = await db
        .select({
            post: post,
            column: column,
            user: user,
        })
        .from(post)
        .leftJoin(column, eq(post.columnId, column.id))
        .leftJoin(user, eq(column.userId, user.id))
        .where(and(
            eq(post.columnId, columnId),
            eq(post.chapter, chapter),
            eq(post.status, true)
        ))
        .execute();

    if (!result.length) {
        throw new Error("Post not found");
    }

    const currentPost = result[0];
    if (!currentPost?.user || !currentPost?.column || !currentPost?.post) {
        return null;
    }
    // 查找上一章（使用子查询优化）
    const prevPost = await db
        .select()
        .from(post)
        .where(and(
            eq(post.columnId, columnId),
            eq(post.status, true),
            sql`${post.chapter} = (
                SELECT MAX(chapter) 
                FROM ${post} 
                WHERE column_id = ${columnId} 
                AND status = true 
                AND chapter < ${chapter}
            )`
        ))
        .execute();

    // 查找下一章（使用子查询优化）
    const nextPost = await db
        .select()
        .from(post)
        .where(and(
            eq(post.columnId, columnId),
            eq(post.status, true),
            sql`${post.chapter} = (
                SELECT MIN(chapter) 
                FROM ${post} 
                WHERE column_id = ${columnId} 
                AND status = true 
                AND chapter > ${chapter}
                AND chapter <= ${maxChapter.chapter}
            )`
        ))
        .execute();
    if (!currentPost?.post) return null;
    return {
        currentPost: currentPost.post,
        user: currentPost.user,
        column: currentPost.column,
        prevPost: prevPost[0],
        nextPost: nextPost[0]
    };
};