import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { column, invitationCode, post, priceList } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const invitationCodeRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        // priceList: z.array(z.object({
        //     id: z.union([z.number(), z.undefined()]),
        //     price: z.number(),
        //     timeLimit: z.number()
        // })),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const code = await ctx.db
        .select()
        .from(invitationCode)
        .where(eq(invitationCode.value, input.id));
      if (code.length < 1) {
        return false;
      }
      const col = await ctx.db
        .select()
        .from(column)
        .where(eq(column.id, input.id));
      if (!col || col.length > 1) {
        return false;
      }
      // input.priceList.map(async (item, index) => {
      //     await ctx.db.insert(priceList).values({
      //         columnId: input.id,
      //         price: item.price,
      //         timeLimit: item.timeLimit
      //     })
      // })
      return ctx.db.insert(column).values({
        id: input.id,
        name: input.name,
        userId: input.userId,
      });
    }),
});
