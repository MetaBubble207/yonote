"use client"
import Image from "next/image";
import React, {useState} from "react";
import {api} from "@/trpc/react";
import {timeToDateString} from "@/tools/timeToString";
import useLocalStorage from "@/tools/useStore";

export const ContentForm=()=>{

    // const options = [
    //     { title: '文章内容标题', isTop: true, isFree: true, label: '免费 全部', updatedAt: '2017-10-31 23:12:00', publishedAt: '2017-10-31 23:12:00' },
    //     { title: '标题1', isTop: true, isFree: false, label: '全部', updatedAt: '2017-10-31 23:12:00', publishedAt: '2017-10-31 23:12:00' },
    //     { title: '标题2', isTop: false, isFree: true, label: '免费', updatedAt: '2017-10-31 23:12:00', publishedAt: '2017-10-31 23:12:00' },
    //     { title: '标题3', isTop: false, isFree: true, label: '全部', updatedAt: '2017-10-31 23:12:00', publishedAt: '2017-10-31 23:12:00' },
    // ];
    let contentData:any;
    const [data,setData] = useState([])
    const [token, setToken] = useLocalStorage("token",null);
    // const [data,setData] = useState<ArticleProp[]>(options)
    if(typeof window !== 'undefined'){
        // const token = JSON.parse(localStorage.getItem("token"));
        console.log(token)
        if(token){
            console.log("token===========",token)
            // userId = api.column.getColumnId.useQuery({userId:token}).data
            const columnId = api.column.getColumnId.useQuery({
                userId:token
            }).data!
            console.log(columnId,token)
            contentData = api.post.getAll.useQuery({
                limit: 5,
                offset: 0,
                columnId:columnId
            }).data
        }
    }
    const updateIsTopApi = api.post.updateIsTop.useMutation({
        onSuccess: (r) => {
            console.log(r)
        }
    })
    const updateIsFreeApi = api.post.updateIsFree.useMutation({
        onSuccess: (r) => {
            console.log(r)
        }
    })
    if(contentData){
        // setData(contentData)
    }
    const handleEdit = () => {
        // 编辑文章逻辑
    };

    const handleToggleTop = (index:number) => {
        // 切换置顶状态逻辑
        const newData=[...contentData]
        newData[index]!.isTop=!newData[index]!.isTop

        contentData = newData
        updateIsTopApi.mutate({
            id:newData[index]!.id,
            isTop:newData[index]!.isTop
        })
        console.log(contentData)
        console.log("置顶")

    };

    const handleToggleFree = (index:number) => {
        // 切换免费状态逻辑
        const newData=[...contentData]
        newData[index]!.isFree=!newData[index]!.isFree
        contentData = newData
        updateIsFreeApi.mutate({
            id:newData[index]!.id,
            isFree:newData[index]!.isFree
        })
        console.log(contentData)
    };

    const handleDelete = (index:number) => {
        // 删除文章逻辑
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    interface ArticleProp{
        title:string,
        isTop:boolean,
        isFree:boolean,
        label:string,
        updatedAt:string,
        publishedAt:string
    }

    return(
        <div>
            {/*表格*/}
            <table className="w-94% mt-22px mx-35px pl-63px ">
                <thead className={' border-rd-1 bg-[#FAFAFA]'}>
                <tr className={'h-54px '}>
                    <th className="px-4 pl-63px pr-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">内容标题</th>
                    <th className="px-4 py-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">
                        <div className={'flex items-center '}>
                            <span>状态</span>
                            <span className={'ml-8px'}>
                                    <Image src={"/images/writer/management/state.png"} alt={"状态图标"} width={10} height={10}/>
                                </span>
                        </div>
                    </th>
                    <th className="px-4 py-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">
                        <div className={'flex items-center '}>
                            <span>标签</span>
                            <span className={'ml-8px'}>
                                    <Image src={"/images/writer/management/sort.png"} alt={"标签排序图标"} width={12} height={12}/>
                                </span>
                        </div>
                    </th>
                    <th className="px-4 py-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">
                        <div className={'flex items-center '}>
                            <span>更新时间</span>
                            <span className={'ml-8px'}>
                                    <Image src={"/images/writer/management/sort2.png"} alt={"更新时间排序图标"} width={12} height={12}/>
                                </span>
                        </div>
                    </th>
                    <th className="px-4 py-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">
                        <div className={'flex items-center '}>
                            <span>发布时间</span>
                            <span className={'ml-8px'}>
                                    <Image src={"/images/writer/management/sort2.png"} alt={"更新时间排序图标"} width={12} height={12}/>
                                </span>
                        </div>
                    </th>
                    <th className="px-4 py-2 text-left text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">操作</th>
                </tr>
                </thead>
                <tbody>
                {contentData?.map((option:any, index:number) => (
                    <tr key={index} className={'h-52px'}>
                        <td className="px-4 pl-63px pr-2 text-left text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5">{option?.name}</td>
                        <td className={`px-4 py-2 text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5 ${option.isTop ? 'text-[#1DB48D]' : ''} ${option.isFree ? 'text-[#1DB48D]' : ''}`}>{option.isTop ? '置顶' : ''} {option.isFree ? '免费' : ''}</td>
                        <td className="px-4 py-2 text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5">{option.tag}</td>
                        <td className="px-4 py-2 text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5">{timeToDateString(option.createdAt)}</td>
                        <td className="px-4 py-2 text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5">{timeToDateString(option.updatedAt)}</td>
                        <td className="px-4 py-2">
                            <button className="mr-2 text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5" onClick={handleEdit}>编辑</button>
                            <button className="mr-2 text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5" onClick={()=> handleToggleTop(index)}>{option.isTop ? '取消置顶' : '置顶'}</button>
                            <button className="mr-2 text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5" onClick={()=> handleToggleFree(index)}>{option.isFree ? '取消免费' : '免费'} </button>
                            <button className={'mr-2 text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5'} onClick={()=> handleDelete(index)}>删除</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

)
}
