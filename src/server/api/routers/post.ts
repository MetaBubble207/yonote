import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { post } from "@/server/db/schema";
import { and, desc, eq, gt, like, lt, sql } from "drizzle-orm";
import { getCurrentTime } from "@/tools/getCurrentTime";
import { createCaller } from "@/server/api/root";
import { getDetailPost } from "../tools/postQueries";

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        content: z.string(),
        tag: z.string(),
        status: z.boolean(),
        columnId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const record = db
        .select()
        .from(post)
        .where(eq(post.columnId, input.columnId));
      const chapter = (await record).length + 1;

      const caller = createCaller(ctx);
      // 更新专栏创作时间
      await caller.column.changeUpdatedAt({ id: input.columnId });
      return db
        .insert(post)
        .values({
          name: input.name,
          content: input.content,
          tag: input.tag,
          status: input.status,
          updatedAt: getCurrentTime(),
          columnId: input.columnId,
          chapter: chapter,
        })
        .returning({
          name: post.name,
          content: post.content,
          tag: post.tag,
          status: post.status,
          columnId: post.columnId,
          chapter: post.chapter,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          isTop: post.isTop,
          isFree: post.isFree,
        });
    }),

  updateIsTop: publicProcedure
    .input(z.object({ id: z.number(), isTop: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(post)
        .set({ isTop: input.isTop })
        .where(eq(post.id, input.id));
    }),

  updateIsFree: publicProcedure
    .input(z.object({ id: z.number(), isFree: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(post)
        .set({ isFree: input.isFree })
        .where(eq(post.id, input.id));
    }),

  deletePost: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(post).where(eq(post.id, input.id));
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.post.findFirst({
      orderBy: (post, { desc }) => [desc(post.createdAt)],
    });
  }),

  getAll: publicProcedure
    .input(z.object({ columnId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.post.findMany({
        where: and(eq(post.columnId, input.columnId), eq(post.status, true)),
      });
    }),

  getPostsFilter: publicProcedure
    .input(
      z.object({
        columnId: z.string().optional(),
        title: z.string().optional().default(""),
        tag: z.string().optional().default(""),
        startDate: z.string().nullable().optional(),
        endDate: z.string().nullable().optional(),
        isTop: z.boolean().optional(),
        isFree: z.boolean().optional(),
        pageSize: z.number().optional().default(10),
        currentPage: z.number().optional().default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      if (!input.columnId) return { data: [], total: 0 };
      // 构建查询条件
      const whereConditions = [
        eq(post.columnId, input.columnId),
        eq(post.status, true),
      ];
      // 计算总数
      const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(post)
        .where(and(...whereConditions))
        .then(result => Number(result[0]?.count) || 0);
      // 只在有值时添加条件，避免不必要的空字符串检查
      if (input.title) whereConditions.push(like(post.name, `%${input.title}%`));
      if (input.tag) whereConditions.push(like(post.tag, `%${input.tag}%`));
      if (input.startDate) whereConditions.push(gt(post.createdAt, new Date(input.startDate)));
      if (input.endDate) whereConditions.push(lt(post.createdAt, new Date(input.endDate)));
      if (input.isTop !== undefined) whereConditions.push(eq(post.isTop, input.isTop));
      if (input.isFree !== undefined) whereConditions.push(eq(post.isFree, input.isFree));
      const data = await db.select().from(post).where(and(...whereConditions))
        .orderBy(desc(post.isTop), desc(post.updatedAt))
        .limit(input.pageSize)
        .offset((input.currentPage - 1) * input.pageSize)
      return { data, total };
    }),

  getAllPost: publicProcedure
    .input(z.object({ columnId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(post)
        .where(eq(post.columnId, input.columnId));
    }),

  // 专栏详情页展示有序的章节数
  getAllInOrder: publicProcedure
    .input(z.object({ columnId: z.string(), activeCategory: z.string() }))
    .query(async ({ ctx, input }) => {
      const postNoTop = ctx.db
        .select()
        .from(post)
        .where(and(eq(post.columnId, input.columnId), eq(post.isTop, false)))
        .orderBy(post.createdAt);
      const postIsTop = ctx.db
        .select()
        .from(post)
        .where(and(eq(post.columnId, input.columnId), eq(post.isTop, true)))
        .orderBy(post.createdAt);
      if (input.activeCategory == "全部") {
        return [...(await postIsTop), ...(await postNoTop)];
      } else if (input.activeCategory == "免费") {
        return [...(await postIsTop), ...(await postNoTop)].filter(
          (item) => item.isFree == true,
        );
      } else if (input.activeCategory == "置顶") {
        return [...(await postIsTop)];
      } else {
        const postIsTopTag = (await postIsTop).filter((item) =>
          item.tag.includes(input.activeCategory),
        );
        const postNoTopTag = (await postNoTop).filter((item) =>
          item.tag.includes(input.activeCategory),
        );
        return [...postIsTopTag, ...postNoTopTag];
      }
    }),

  getDetailPostById: publicProcedure
    .input(z.object({ id: z.string(), chapter: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id, chapter } = input;
      const { db } = ctx;
      return getDetailPost(db, id, chapter);
    }),

  getPostCount: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.post.findMany({
        where: and(eq(post.columnId, input), eq(post.status, true)),
      });
      // 返回所有根据 id 查询的数据
      return data.length;
    }),

  getPostTag: publicProcedure
    .input(z.object({ columnId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.post.findMany({
        where: eq(post.columnId, input.columnId),
      });
      const res = [];
      data.map((item) => {
        const temp = item.tag.split(",");
        res.push(...temp);
      });
      // 过滤掉重复和空值
      return [...new Set(res)].filter((item) => item !== "");
    }),

  getByName: publicProcedure
    .input(z.object({ title: z.string(), tag: z.string() }))
    .query(async ({ ctx, input }) => {
      const userData = await ctx.db
        .select()
        .from(post)
        .where(
          and(
            like(post.name, `%${input.title}%`),
            like(post.tag, `%${input.tag}%`),
          ),
        );
      console.log(userData);
    }),

  getPostId: publicProcedure
    .input(z.object({ id: z.string(), chapter: z.number() }))
    .query(async ({ ctx, input }) => {
      const postId = await ctx.db.query.post.findFirst({
        where: and(
          eq(post.columnId, input.id),
          eq(post.chapter, input.chapter),
        ),
      });
      return postId.id;
    }),

  getByPostId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.post.findFirst({
        where: eq(post.id, input.id),
      });
      if (!data) {
        throw new Error("No data found");
      }
      return data;
    }),

  getDraft: publicProcedure
    .input(z.object({ columnId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.post.findFirst({
        where: and(eq(post.columnId, input.columnId), eq(post.status, false)),
      });
    }),

  updatePost: publicProcedure
    .input(
      z.object({
        id: z.number(),
        columnId: z.string(),
        name: z.string(),
        content: z.string(),
        tag: z.string(),
        status: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const caller = createCaller(ctx);
      // 更新专栏创作时间
      await caller.column.changeUpdatedAt({ id: input.columnId });
      return ctx.db
        .update(post)
        .set({
          name: input.name,
          content: input.content,
          tag: input.tag,
          status: input.status,
        })
        .where(eq(post.id, input.id));
    }),

  getPostTagsList: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const postData = await ctx.db.query.post.findMany({
        where: eq(post.columnId, input),
      });
      const res: string[] = ['all', 'free', 'top'];
      postData.map((item) => {
        const temp = item.tag?.split(",");
        if (temp) res.push(...temp);
      });
      // 过滤掉重复和空值
      return [...new Set(res)].filter((item) => item !== "");
    }),
});
