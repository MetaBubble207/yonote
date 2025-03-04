import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { distributorshipDetail } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getOneDistributorshipDetail } from "../tools/distributorshipDetailQueries";

export const distributorshipDetailRouter = createTRPCRouter({
  getOne: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const res = await getOneDistributorshipDetail(ctx.db, input);
    if (!res) {
      return null;
    }
    return res;
  }),

  update: publicProcedure
    .input(
      z.object({
        isVip: z.boolean(),
        columnId: z.string(),
        distributorship: z.number(),
        extend: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { columnId, distributorship, extend, isVip } = input;
      // 检测vip身份和平台抽成的情况
      if (distributorship + extend > 0.7) {
        throw new Error("经销分成加推广分成比例超过百分之70");
      }
      return ctx.db
        .update(distributorshipDetail)
        .set({
          distributorship: distributorship,
          extend: extend,
          platDistributorship: isVip ? 0.06 : 0.15
        })
        .where(eq(distributorshipDetail.columnId, columnId));
    }),

  add: publicProcedure
    .input(
      z.object({
        columnId: z.string(),
        distributorship: z.number(),
        extend: z.number(),
        isVip: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { columnId, distributorship, extend, isVip } = input;
      const platDistributorship = isVip ? 0.06 : 0.15;
      if (distributorship + extend > 0.7) {
        throw new Error("经销分成加推广分成比例超过百分之70");
      }
      return ctx.db.insert(distributorshipDetail).values({
        platDistributorship: platDistributorship,
        distributorship: distributorship,
        extend: extend,
        columnId: columnId,
      });
    }),
});
