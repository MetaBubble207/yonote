import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { user, post, column, subscription} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import {getCurrentTime} from "@/tools/getCurrentTime";
import { and } from "drizzle-orm";
export const subscriptionRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
        userId: z.string(),
        columnId: z.string(),
    })).mutation(({ctx,input}) => {
        return ctx.db.insert(subscription).values({
            userId: input.userId,
            columnId: input.columnId,
            status: true,
            createdAt: getCurrentTime(),
            updatedAt: getCurrentTime(),
        })
    }),
});