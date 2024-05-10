import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {column, user} from "@/server/db/schema";
import {eq} from "drizzle-orm";

export const columnRouter = createTRPCRouter({

    create: publicProcedure.input(z.object({
        id:z.string(),
        name: z.string(),
        price:z.number(),
        userId:z.string()
    })).mutation(({ctx,input}) => {

        return  ctx.db.insert(column).values({
            id: input.id,
            name: input.name,
            price: input.price,
            userId: input.userId,
        }).returning({id:column.id,name:column.name,price:column.price})
    }),

    // getAll: publicProcedure
    //     .input(z.object({id:z.number()}))
    //     .query(({ctx,input})=>{
    //         console.log(input.id)
    //     return ctx.db.select().from(column).where(eq(column.id,input.id))
    // }),
    getColumnId: publicProcedure
        .input(z.object({userId:z.string()}))
        .query(async({ ctx,input }) => {
                const data = await ctx.db.query.column.findFirst({where:eq(column.userId,input.userId)})
            return data?.id;
        }),
    getColumn: publicProcedure
        .input(z.object({userId:z.string()}))
        .query(async({ ctx,input }) => {
            return ctx.db.query.column.findFirst({where: eq(column.userId, input.userId)});
        }),
    update: publicProcedure
        .input(z.object({id:z.string(),name:z.string(),price:z.number(),introduce:z.string()}))
        .mutation( async ({ ctx,input }) => {
            return ctx.db.update(column).set({
                name: input.name,
                price:input.price,
                introduce:input.introduce,
            })
        }),
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            const columns = await ctx.db.select().from(column);
            const promises = columns.map(async item => {
                const u = await ctx.db.query.user.findFirst({ where: eq(user.id, item.userId)});
                return { ...item, user: u };
            });
            const res = await Promise.all(promises);
            console.log(res)
            return res;
        })
});
