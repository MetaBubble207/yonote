import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {z} from "zod";
import { user } from "@/server/db/schema";
import {eq} from "drizzle-orm";
import {getCurrentTime} from "@/tools/getCurrentTime";

export const userRouter = createTRPCRouter({
    getList: publicProcedure
        .input(
            z.object(
        {
                    limit: z.number(), offset: z.number()
                }
        ))
        .query( ({ctx,input}) => {
            return  ctx.db.query.user.findMany(
                {
                    limit: input.limit,
                    offset: input.offset
                }
            )
        }),

    create: publicProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation( async ({ ctx, input }) => {

            await new Promise((resolve) => setTimeout(resolve, 1000));

            return  ctx.db.insert(user).values({
                name: input.name,
                updatedAt: getCurrentTime()
            }).returning({name: user.name});
        }),

    update: publicProcedure
        .input(z.object({ id: z.number(), name: z.string().min(1) }))
        .mutation( ({ ctx, input })=>{
            return ctx.db.update(user)
                .set({
                    name: input.name,
                    updatedAt: getCurrentTime()
                    })
                .where(eq(user.id,input.id))
                .returning({name:user.name})
        }),

    del: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input })=>{
          return ctx.db.delete(user).where(eq(user.id, input.id)).returning({name: user.name});
        }),

    getLatest: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.post.findFirst({
            orderBy: (post, { desc }) => [desc(post.createdAt)],
        });
    }),
});
