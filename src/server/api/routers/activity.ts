import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { activity } from "@/server/db/schema";
import { getCurrentTime } from "@/tools/getCurrentTime";

export const activityRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const activities = await ctx.db.select().from(activity);
    const currentTime = getCurrentTime();
    return activities
      .filter((item) => new Date(item.endDate) > currentTime)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }),
});
