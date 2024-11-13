import React from "react";
import Image from "next/image";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {api} from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";


interface PreviewProps {
    title: string;
    html: string;
    tags: string[];
}

const Preview = ({title, html, tags}: PreviewProps) => {
    const token = useLocalStorage("token", null)
    const user = api.users.getOne.useQuery({
        id: token[0],
    }).data
    console.log(user)
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const months = currentDate.getMonth();
    const days = currentDate.getDate();
    const specificDate = `${year}-${months}-${days}`;

    return (
        <div>
            <div className="w-93 shrink-0 stroke-0.25 stroke-[#D9D9D9] ml-4.5 b-1 b-#d9d9d9 relative">
                <div
                    className="text-[rgba(0,0,0,0.85)] text-5 font-not-italic font-400 lh-5.5 ml-3.725 mt-3.725 h-10 overflow-auto">
                    <div className="break-all" dangerouslySetInnerHTML={{__html: title}}></div>
                </div>

                <div className="flex mt-10px items-center space-y-0 mb-22px ml-3.725 mt-4">
                    {/*左边头像*/}
                    <div className={""}>
                        <div>
                            <Image src={user?.avatar} alt={"心智与阅读"} width={33} height={33}/>
                        </div>
                    </div>
                    {/*昵称，日期，VIP*/}
                    <div>
                        <div className={"flex items-center"}>
                            <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>
                                {user?.name}</div>
                            {user?.idType === 1 &&
                                <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12}
                                       height={12} className={"ml-1"}/>
                            }
                        </div>
                        <div
                            className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>{specificDate}发布
                        </div>
                    </div>
                </div>
                <div
                    className={"w-91% mt-24px shrink-0 text-[#666] text-3.5 font-not-italic font-400 lh-[120%] m-auto"}>
                    <div className="h-79 overflow-auto">
                        <div className="break-all h-20" dangerouslySetInnerHTML={{__html: html}}></div>
                    </div>
                </div>
                <div className="flex mt-5 ml-3.725 w-23 h-40px ">
                    {tags.map((tag, index) => (
                        <span key={index} className=" w-15.5 text-[#1DB48D] text-3 font-400 mr-3">#{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Preview;
