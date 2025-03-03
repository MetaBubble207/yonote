import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { runningWater } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const runningWaterRouter = createTRPCRouter({
  getRunningWater: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(runningWater)
        .where(eq(runningWater.userId, input.id));
    }),
});
