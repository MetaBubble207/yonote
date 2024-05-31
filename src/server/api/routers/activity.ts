import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { activity } from "@/server/db/schema";

export const activityRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async ({ ctx }) => {
        const activities = await ctx.db.select().from(activity);
        return activities;
  })
});
