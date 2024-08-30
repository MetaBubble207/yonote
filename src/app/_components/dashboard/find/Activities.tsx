"use client"
import Image from "next/image";
import React, {useState, useEffect} from "react";
import {api} from "@/trpc/react";
import {getCurrentTime} from "@/tools/getCurrentTime";
import Link from "next/link";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import {Button, Skeleton} from "antd";
import withTheme from "@/theme";

const Activities = function Activities() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const queryData = api.activity.getAll.useQuery().data;
    // 在数据加载完成时更新状态
    useEffect(() => {
        if (queryData) {
            const currentTime = getCurrentTime();
            //过滤未截止的活动
            const goingData = queryData.filter(item => {
                const endDate = new Date(item.endDate);
                return endDate > currentTime;
            });

            goingData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setData(goingData);
            setLoading(false);
        }
    }, [queryData]);

    if (loading) return <>
        <Skeleton
            active
            paragraph={{rows: 5}}
            title={false}
            className="mt-4 h-36.25 w-full border-rd-4 bg-[#FFF] p5"
        />
        <Skeleton
            active
            paragraph={{rows: 5}}
            title={false}
            className="mt-4 h-36.25 w-full border-rd-4 bg-[#FFF] p5"
        />
        <Skeleton
            active
            paragraph={{rows: 5}}
            title={false}
            className="mt-4 h-36.25 w-full border-rd-4 bg-[#FFF] p5"
        />
    </>

    return (
        <div>
            {data?.map(item => (
                <Link href="/dashboard/find/recommend" key={item.id}>
                    <div className="inline mt-4 h-36.25 w-full border-rd-4 bg-[#FFF] flex relative " key={item.id}>
                        <div className="inline mt-2.5 ml-2.5 h-31.25 w-80.75 item-center flex  ">
                            <div className=" flex flex-col">
                                <div className="w-33 h-5 text-[#252525] text-3.75  font-500 lh-6 ml-46 mt-1.75"
                                     style={{
                                         wordWrap: 'break-word',
                                         overflow: 'hidden'
                                     }}>
                                    {item.name}
                                </div>
                                <div
                                    className="w-33 h-11.5 mt-1.25 ml-46 w-13.75 text-[#666] text-3.25  font-400 lh-[120%]"
                                    style={{
                                        wordWrap: 'break-word',
                                        overflow: 'hidden'
                                    }}>
                                    {item.introduction}
                                </div>
                            </div>
                            <div className={"absolute"}>
                                <div className='relative w-41 h-31.25'>
                                    <Image
                                        placeholder="blur"
                                        blurDataURL={DefaultLoadingPicture()}
                                        src={item.cover ?? DefaultLoadingPicture()}
                                        alt='cover'
                                        quality={100}
                                        fill
                                        loading='lazy'
                                        className='rounded-4 object-cover'
                                    />
                                </div>
                            </div>

                            <div
                                className={` absolute top-2.5 left-2.5 w-11.75 h-5.25 border-rd-[0px_25px_25px_0px] bg-[#4EDFE9]`}>
                                <div className="ml-1.75 mt-1 text-[#FFF] text-2.5 font-500 lh-[120%]">进行中</div>
                            </div>
                            <div
                                className={`ml-61 mt-23.5 p0 border-0 absolute right-4 bottom-4`}>
                                <Button
                                    type={'primary'}
                                    size={'small'}
                                    style={{
                                        fontSize: '12px',
                                        width: '18.25',
                                        height: '6.25',
                                        backgroundColor: '#DAF9F1',
                                        color: '#1DB48D',
                                        fontWeight: 500,
                                        borderRadius: '9999px'
                                    }}
                                >
                                    立即查看
                                </Button>
                            </div>


                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
const Page = () => {
    return withTheme(<Activities/>)
}
export default Page;

