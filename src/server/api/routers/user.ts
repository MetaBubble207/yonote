import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {z} from "zod";
import {user} from "@/server/db/schema";
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

    getAccessToken:  publicProcedure.input(z.object({code:z.string()}))
        .query(async({input }) => {
            // 测试使用的appid
            //https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
            const appid = "wx7b8dfff150d551ab";
            // 测试使用的appsecret
            const appsecret = "108638f33a60ffa3486d50572c8aa2f3";
            // 获取access_token
            const get_access_token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${input.code}&grant_type=authorization_code`;
            return fetch(get_access_token_url)
                // 转成json
                .then(r => r.json())
                // 通过返回的access_token和openid去请求另一个地址获取用户信息
                .then((r) => {
                    const get_user_info_url = `https://api.weixin.qq.com/sns/userinfo?access_token=${r.access_token}&openid=${r.openid}&lang=zh_CN`;
                    return fetch(get_user_info_url).then((res) => res.json());
                 })
    }),
});
