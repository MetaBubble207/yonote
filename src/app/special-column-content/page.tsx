import Image from "next/image";

const Page=()=>{
    return (
    <div className={"relative bg-#F5F7FB h-screen"}>
        <div className={"ml-16px mb-50px"}>
            {/*上方分享*/}
            <div className={"flex justify-end items-center pt-16px"}>
                <div className={"inline-block w-14.25 h-6 text-[#252525] shrink-0 bg-#5CE5C1 text-2.5 font-500 lh-6 text-center rounded-10px"}>加速计划</div>
                <div className={"inline-block ml-10px mr-16px"}>
                    <Image src={"/images/special-column/Share-black.png"} alt={"心智与阅读"} width={12} height={12}/>
                </div>
            </div>

            {/*头像，昵称，时间*/}
            <div>
                心智与阅读
            </div>
            <div className="flex mt-10px items-center space-y-0 mb-22px">

                {/*左边头像*/}
                <div className={""}>
                    <div>
                        <Image src={"/images/special-column/Ellipse 2.png"} alt={"心智与阅读"} width={33} height={33}/>
                    </div>
                </div>
                {/*昵称，日期，VIP*/}
                <div>
                    <div className={"flex items-center"}>
                        <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>芋圆</div>
                        <div>
                            <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12} height={12} className={"lh-0"} style={{marginLeft:"2.5px"}}/>
                        </div>
                    </div>
                    <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>3.02  12:30发布</div>
                </div>
            </div>

            {/*内容*/}
            <div>
                <Image src={"/images/special-column/Rectangle 442.png"} alt={"心智与阅读"} width={343} height={161}/>
            </div>
            <div className={"w-91% mt-24px shrink-0 text-[#666] text-3.5 font-not-italic font-400 lh-[120%]"}>
                情绪价值波动，上上签，愤怒，变化，偏执，创造 情绪价值波动，上上签，愤怒，变化，偏执，创造 情绪价值波动，上上签，愤怒，变化，偏执，创造
            </div>
        </div>


        {/*页面底端上一篇下一篇*/}
        <div className={"absolute w-100% h-140px bottom-0px bg-[#FFF]"}>

            {/*标签*/}
            <div className="flex justify-between mt--40px mx-16px">
                <div className="flex flex-col">
                    <div className={"text-[#1DB48D] text-3 font-not-italic font-400 lh-6"}># 标签在这</div>
                </div>
                <div className="flex flex-col">
                    <div className="ml-24px flex items-center space-y-0">
                        <div>
                            <Image src={"/images/special-column/heart 1.png"} alt={"爱心"} width={18} height={18} objectFit="none"/>
                        </div>
                        <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>1090</div>
                    </div>
                </div>
            </div>

            <div className={"mx-16px"}>

                {/*目录*/}
                <div className={"flex items-center mt-30px"}>
                    <div className={"text-[#666] text-2.5 font-not-italic font-400 lh-14px"}>心智与阅读•目录</div>
                    <div className={"ml-5px"}>
                        <Image src={"/images/special-column/Sort-one (排序1).png"} alt={"心智与阅读"} width={14} height={14}/>
                    </div>
                </div>

                {/*上一篇下一篇*/}
                <div className="flex mt-8px">
                    <div className="flex flex-col">
                        <div className={"flex items-center"}>
                            <div>
                                <Image src={"/images/special-column/Double-left (双左).png"} alt={"心智与阅读"} width={14} height={14}/>
                            </div>
                            <div className={"text-[#333] text-3 font-not-italic font-400 lh-6 ml-5px"}>上一篇</div>
                        </div>
                        <div className={"w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6"}>回忆·后来的我们毕业了</div>
                    </div>
                    <div className="flex flex-col ml-auto ">
                        <div className={"flex items-center justify-end"}>
                            <div className={"text-[#333] text-3 font-not-italic font-400 lh-6 "}>上一篇</div>
                            <div>
                                <Image src={"/images/special-column/Double-left (双右) .png"} alt={"心智与阅读"} width={14} height={14}/>
                            </div>
                        </div>
                        <div className={"w-27.6665 text-[#333]  text-3 font-not-italic font-400 lh-6 text-right"}>回忆·后来的我们毕业了</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Page;