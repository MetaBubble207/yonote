"use client"
import Image from "next/image"
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import { useEffect, useState } from "react";

export const SpecialColumn = () => {
    const params = useSearchParams();
    const columnId = params.get("id") ;
    const userId = api.column.getUserId.useQuery({
        id: columnId,
      });
    
    const { data: user} = api.users?.getOne.useQuery({
    id: userId.data,
    });

    const column = api.column.getColumnDetail.useQuery({
        columnId: columnId,
    }).data;

    let userInfo;
    const [token, setToken] = useLocalStorage("token", null);
    if (typeof window !== "undefined"){
        const searchParams = useSearchParams();
        const code = searchParams.get("code");
        if (code && token === null){
            userInfo = api.users.login.useQuery({
                code:code
            }).data;
            if (userInfo){
                setToken(userInfo.id);
            }
        }
        if (token) {
            userInfo = api.users.getOne.useQuery({ id: token }).data;
        }
    }

    const order = api.order.getColumnOrder.useQuery({
        columnId: columnId,
    })

    const read = api.post.getAll.useQuery({
        columnId: columnId,
        limit: 10000,
        offset: 0,
    });

    const [columnIntro, setColumnIntro] = useState("");
    // useEffect(() => {
    //     if (column?.introduce  && column.introduce.length > 176) {
    //         setColumnIntro(column.introduce = column.introduce.substring(0, 101) + "...");
    //     } else {
    //         setColumnIntro(column?.introduce)
    //     }
        
    // }, [column?.introduce || null])
    useEffect(() => {
        if (column && column.introduce) {
            if (column.introduce.length > 176) {
                setColumnIntro(column.introduce.substring(0, 101) + "...");
            } else {
                setColumnIntro(column.introduce);
            }
        } else {
            setColumnIntro("暂无数据");
        }
    }, [column]);
    

    return <div className="relative min-h-screen bg-[#999999] pt-25.75">
    <div className="w-85.75 h-129.5005 bg-[#ffffff] ml-4">
        {/* 顶部作者信息 */}
        <div className="flex">
            <div className="flex items-center w-full h-19.375">
                {/* 作者头像与名称 */}
                <Image src={user?.avatar?user?.avatar:"/images/recommend/cover.svg"} alt={""} width={49} height={49} className=" w-12.25 h-12.25 shrink-0 ml-5.25 mt-7.125"/>
                <div className="flex flex-col h-20">
                    <div className="text-[#333333] text-3.5 font-500 lh-6 h-5 ml-2.25 mt-8 "
                    style={{
                        overflow:'hidden',
                        textOverflow:'ellipsis',
                        whiteSpace:'nowrap'
                    }}>
                        {user?.name?user?.name:"未知用户"} 
                    </div>
                    {/* 专栏订阅数和内容数 */}
                    <div className="flex items-center ml-2.25">
                        <div  className={"text-[#252525] font-D-DIN text-3.5 font-700 lh-6"}>{order.data?.length}</div>
                        <div className="w-10 text-[#999] text-3 font-400 lh-6 ml-1.25 mt-0.5">订阅</div>
                        <div className="text-[#252525] font-D-DIN text-3.5 font-700 lh-6 ml-1">{read.data?.length}</div>
                        <div className="w-10 text-[#999] text-3 font-400 lh-6 ml-1.25 mt-0.5">内容</div>
                    </div>
                </div>
            </div>
            <Image src={"/images/poster/wholeLogo.svg"} 
                alt="wholeLogo" 
                width={2} 
                height={2} 
                className="w-9.5 h-4.29725 mt-7 mr-5" >
            </Image>
            
        </div>

        {/* 专栏名称 */}
        <div className="h-5.387 text-[#333] text-3.5 font-500 lh-6 mt-9 ml-4.5 mx-10"
            style={{
                overflow:'hidden',
                textOverflow:'ellipsis',
                whiteSpace:'nowrap'
            }}
        >
            {column?.name?column?.name:"暂无数据"}
        </div>

   
        {/* 专栏内容 */}
        <div className="relative w-73 h-44.5 ml-4.5 mt-4"> 
            <Image src={"/images/poster/title1.svg"} alt="title1" width={2} height={2} className="w-14.75 h-5.25" />           
            <div className="flex justify-center items-center mt-3.375">
                <div className="w-25 h-32 relative">
                    {/* 专栏封面 */}
                    <div className="absolute inset-0">
                        <Image 
                            placeholder="blur"
                            blurDataURL={column?.logo ? column?.logo : "/images/recommend/cover.svg"} 
                            src={column?.logo ? column?.logo : "/images/recommend/cover.svg"} 
                            alt="cover" 
                            objectFit="cover"
                            className="rounded"
                            layout="fill"
                        />
                    </div>
                </div>
                {/* 简介内容 */}
                <div className="w-44.744 h-35 text-[#666] text-2.5 font-500 lh-6 ml-2.75 mt-2"
                    style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-flex',
                    WebkitLineClamp: 6
                    }}
                >
                    
                    {columnIntro}
                </div>
            </div>        
        </div>
        
        {/* 底部用户信息 */}
        <div className="flex h-40 ml-4.375 mt-14">
            <div className="w-40 mt-2">
                <button className="flex items-center w-20 h-3">
                    <Image src={"/images/poster/triangle.svg"} alt="triangle" width={2} height={2} className="w-2.58125 h-2.58125 " />
                    <div className="h-5.7 text-[#666] text-2.5 font-500 lh-6 ml-1.5">保存到相册</div>
                </button>

                {/* 用户头像和名称 */}
                <div className="flex items-center mt-3.5">
                    <Image
                        placeholder="blur"
                        blurDataURL={userInfo?.avatar ?? "/images/user/Loading.svg"}
                        src={userInfo?.avatar ?? "/images/user/Loading.svg"}
                        alt="avatar"
                        width={83}
                        height={83}
                        className={
                            "w-4.5 h-4.5 rounded-full stroke-0.25 stroke-[#FFF]"
                        }
                    />
                    <div className="h-5.75 text-[#999] text-2.5 font-500 lh-6 ml-1.25">
                        {token ? userInfo?.name : "未知用户"}
                    </div>
                </div>

                <div className="h-5.75 text-[#999] text-2.5 font-500 lh-6">
                    分享了一篇专栏
                </div>
            </div>

            <div className="w-20 ml-25">
                <Image src={"/images/poster/QRcode.svg"} alt="QRcode" width={2} height={2} className="w-12.5 h-12.5 ml-1.5" />
                <div className="h-5.75 text-[#999] text-2.5 font-400 lh-6 mt-1.25">扫码查看详情</div>
            </div>
        </div>
    </div>
</div>
};
