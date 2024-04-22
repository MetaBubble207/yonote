"use client"
import Image from "next/image"

export const SpecialColumn = () => {
    return <div className="relative w-73 h-44.5 ml-4.5">
        <Image src={"/images/poster/title1.svg"} alt="title1" width={2} height={2} className="w-14.75 h-5.25" />
        <div className="flex justify-center items-center mt-3.375">
            <Image src={"/images/poster/cover.svg"} alt="cover" width={2} height={2} className="w-25.472 h-31.90625 "/>
            <div className="w-44.744 h-38 text-[#666] text-2.5 font-500 lh-6 ml-2.75 mt-2">
               公司简介的用语应该科学简明，语句要尽量简短，要避免包括四个以上逗号的长句式。 不同类别的信息表达，尽可能单独成句，否则就会出现长达一段的长句，给阅读造成困难，甚至抓不住重点，影响简介的功能发。
            </div>
        </div>        
    </div>
}