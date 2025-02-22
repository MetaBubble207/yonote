import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { column, post, user } from "@/server/db/schema";
import { and, eq, gt, like, lt } from "drizzle-orm";
import { getCurrentTime } from "@/tools/getCurrentTime";
import { createCaller } from "@/server/api/root";

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

  getPostFilter: publicProcedure
    .input(
      z.object({
        columnId: z.string(),
        title: z.string(),
        tag: z.string(),
        startDate: z.date().nullable(),
        endDate: z.date().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      // 构建查询条件
      const whereConditions = [
        eq(post.columnId, input.columnId),
        eq(post.status, true),
        ...(input.title ? [like(post.name, `%${input.title}%`)] : []),
        ...(input.tag ? [like(post.tag, `%${input.tag}%`)] : []),
        ...(input.startDate ? [gt(post.createdAt, input.startDate)] : []),
        ...(input.endDate ? [lt(post.createdAt, input.endDate)] : []),
      ];
      return db.query.post.findMany({
        where: and(...whereConditions),
      });
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

  getById: publicProcedure
    .input(z.object({ id: z.string(), chapter: z.number() }))
    .query(async ({ ctx, input }) => {
      const c = await ctx.db.query.column.findFirst({
        where: eq(column.id, input.id),
      });
      if (!c) {
        throw new Error("Column not found");
      }
      const u = await ctx.db.query.user.findFirst({
        where: eq(user.id, c.userId),
      });

      if (!u) {
        throw new Error("User not found");
      }
      const data = await ctx.db
        .select()
        .from(post)
        .where(eq(post.columnId, input.id));
      if (!data?.length) {
        throw new Error("No data found");
      }
      //改变排序方式
      let res = [];
      // data.map(item => {
      //     res.unshift({ ...item, user: u })
      // })

      // return res[input.chapter - 1]
      const newData = data.sort((a, b) => a.chapter - b.chapter);
      newData.map((item) => {
        res.push({ ...item, user: u });
      });
      return res[input.chapter - 1];
    }),

  getNumById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.post.findMany({
        where: eq(post.columnId, input.id),
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
});
