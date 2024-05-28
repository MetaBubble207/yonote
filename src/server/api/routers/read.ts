import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { postLike, user, post, column } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import {getCurrentTime} from "@/tools/getCurrentTime";
import { and } from "drizzle-orm";
export const readRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
        postId: z.number(),
        userId: z.string(),      
        isLike: z.boolean(),     
    })).mutation(({ctx,input}) => {        
        return ctx.db.insert(postLike).values({          
        postId: input.postId,           
        userId: input.userId,         
        isLike: true,          
        updatedAt: getCurrentTime(),   
        }).returning({postId:postLike.postId,userId:postLike.userId})
    }),
});