import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { column, order, user } from "@/server/db/schema";
import { and, desc, eq, like, or } from "drizzle-orm";
import { uniqueArray } from "@/tools/uniqueArray";

export const columnRouter = createTRPCRouter({

    create: publicProcedure.input(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        userId: z.string()
    })).mutation(({ ctx, input }) => {

        return ctx.db.insert(column).values({
            id: input.id,
            name: input.name,
            price: input.price,
            userId: input.userId,
        }).returning({ id: column.id, name: column.name, price: column.price })
    }),

    // getAll: publicProcedure
    //     .input(z.object({id:z.number()}))
    //     .query(({ctx,input})=>{
    //         console.log(input.id)
    //     return ctx.db.select().from(column).where(eq(column.id,input.id))
    // }),
    getColumnId: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            const data = await ctx.db.query.column.findFirst({ where: eq(column.userId, input.userId) })
            return data?.id;
        }),
    getColumn: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.query.column.findFirst({ where: eq(column.userId, input.userId) });
        }),
    update: publicProcedure
        .input(z.object({ id: z.string(), name: z.string(), price: z.number(), introduce: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.update(column).set({
                name: input.name,
                price: input.price,
                introduce: input.introduce,
            })
        }),
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            const columns = await ctx.db.select().from(column)
            const promises = columns.map(async item => {
                const u = await ctx.db.query.user.findFirst({ where: eq(user.id, item.userId) });
                return { ...item, user: u };
            });
            const res = await Promise.all(promises);
            return res;
        }),

    getColumnName: publicProcedure
        .input(z.object({ searchValue: z.string() }))
        .query(async ({ ctx, input }) => {
            let res = [];

            const userData = await ctx.db.query.user.findMany({ where: like(user.name, `%${input.searchValue}%`) }); // 假设 user 表中包含了 name 字段
            if (userData) {
                const promises = userData.map(async (item) => {
                    const columnInfo = await ctx.db.select().from(column).where(eq(column.userId, item.id))
                    return { ...columnInfo[0], user: { ...item } }
                })
                res.push(await Promise.all(promises));
                console.log(res)
            } else {
                throw new Error('Column not found');
            }

            const columnData = await ctx.db.select().from(column).where(like(column.name, `%${input.searchValue}%`))
            if (columnData) {
                const promises = columnData.map(async (item) => {
                    const userInfo = await ctx.db.select().from(user).where(eq(user.id, item.userId))
                    return { ...item, user: userInfo[0] }
                })
                res.push(await Promise.all(promises));
            } else {
                throw new Error('Column not found');
            }
            res = res[0].concat(res[1])
            res = uniqueArray(res, "id")
            return res;

        }),

    getCreateAt: publicProcedure
        .query(async ({ ctx }) => {
            const columns = await ctx.db.select().from(column).orderBy(desc(column.createdAt))
            const promises = columns.map(async item => {
                const u = await ctx.db.query.user.findFirst({ where: eq(user.id, item.userId) });
                return { ...item, user: u };
            });
            const res = await Promise.all(promises);
            return res;

        }),

    getContentNumber: publicProcedure
        .query(async ({ ctx }) => {
            const columns = await ctx.db.select().from(column).orderBy(desc(column.introduce))
            const promises = columns.map(async item => {
                const u = await ctx.db.query.user.findFirst({ where: eq(user.id, item.userId) });
                return { ...item, user: u };
            });
            const res = await Promise.all(promises);
            return res;

        }),

    getUserId: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const userId = await ctx.db.select().from(column).where(eq(column.id, input.id))
            return userId[0].userId;
        }),

});
