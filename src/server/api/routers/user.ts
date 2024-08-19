import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {z} from "zod";
import {user} from "@/server/db/schema";
import {eq} from "drizzle-orm";
import {getCurrentTime} from "@/tools/getCurrentTime";
import * as process from "process";
import {getSoleId} from "@/tools/getSoleId";
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
    getOne: publicProcedure
        .input(z.object({id: z.string()}))
        .query(({ctx,input}) => {
            if(input.id === ""){
                return null
            }
            return ctx.db.query.user.findFirst(
                {
                    where: eq(user.id,input.id)
                }
            )
        }),
    create: publicProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation( async ({ ctx, input }) => {

            await new Promise((resolve) => setTimeout(resolve, 1000));

            return await ctx.db.insert(user).values({
                id: "123123",
                name: input.name,
                updatedAt: getCurrentTime()
            }).returning({name: user.name});
        }),

    update: publicProcedure
        .input(z.object({ id: z.string(), name: z.string().min(1) }))
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
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input })=>{
          return ctx.db.delete(user).where(eq(user.id, input.id)).returning({name: user.name});
        }),

    login:  publicProcedure.input(z.object({code:z.string()}))
        .query(async({ctx,input }) => {
            // 测试使用的appid
            //https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
            const appid = process.env.NEXT_PUBLIC_APP_ID;
            // 测试使用的appsecret
            const appsecret = process.env.NEXT_PUBLIC_APP_SECRET;
            // 获取access_token
            const get_access_token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${input.code}&grant_type=authorization_code`;
            try {
                const accessTokenResponse = await fetch(get_access_token_url);
                if (!accessTokenResponse.ok) {
                    throw new Error('Failed to fetch access token');
                }

                const accessTokenData = await accessTokenResponse.json();

                const getUserInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessTokenData.access_token}&openid=${accessTokenData.openid}&lang=zh_CN`;

                const userInfoResponse = await fetch(getUserInfoUrl);
                if (!userInfoResponse.ok) {
                    throw new Error('Failed to fetch user info');
                }

                const userInfoData = await userInfoResponse.json();

                const getUserDB = await ctx.db.select().from(user).where(eq(user.id, userInfoData.openid));

                if(getUserDB === null || getUserDB.length === 0){
                    return (await ctx.db.insert(user).values({
                        id: userInfoData.openid,
                        name: userInfoData.nickname,
                        avatar: userInfoData.headimgurl,
                        sex: userInfoData.sex,
                        idNumber: getSoleId(),
                        updatedAt: getCurrentTime()
                    }).returning({id:user.id,name: user.name,avatar:user.avatar,sex:user.sex}))[0]
                }
                return getUserDB[0];

            } catch (error) {
                console.error('Error:', error);
            }

    }),

    updateAvatar: publicProcedure.input(z.object({ id: z.string(), avatar: z.string().min(1)}))
        .mutation(({ctx,input})=>{
            return ctx.db.update(user)
                .set({
                    avatar: input.avatar,
                    updatedAt: getCurrentTime()
                    })
                .where(eq(user.id,input.id))
                .returning({avatar:user.avatar})
        }),

    updatePhone: publicProcedure.input(z.object({ id: z.string(), phone: z.string()}))
        .mutation(({ctx,input})=>{
            return ctx.db.update(user)
                .set({
                    phone: input.phone,
                    updatedAt: getCurrentTime()
                })
                .where(eq(user.id,input.id))
                .returning({phone:user.phone})
        }),
    updateName: publicProcedure.input(z.object({ id: z.string(), name: z.string()}))
        .mutation(({ctx,input})=>{
            return ctx.db.update(user)
                .set({
                    name: input.name,
                    updatedAt: getCurrentTime()
                })
                .where(eq(user.id,input.id))
                .returning({name:user.name})
        }),
});
