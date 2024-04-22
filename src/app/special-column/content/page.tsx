import Image from "next/image";
import {SpecialColumnContentBottom} from "@/app/_components/special-column/SpecialColumnContentBottom";

const Page=()=>{

    return <div className={"relative bg-#F5F7FB h-screen"}>
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
        <SpecialColumnContentBottom></SpecialColumnContentBottom>
    </div>
}

export default Page;