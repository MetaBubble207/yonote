import Image from "next/image"

const Result =()=>{
    return(
        <div className="h-23 w-full mt-6 bg-[#FFF] flex items-start">  
            <div className="flex items-start">
                <Image src={"/images/search/cover.svg"} alt="cover" width={18.2} height={24.8} className="w-17.25 h-23" />
                <div className="pl-3 flex flex-col">
                    <div className="text-[#252525] text-3.75 font-500 lh-6">「心智与阅读系列：和人家啊已经 是豪丝娜的」</div>
                    <div className="flex items-center">
                        <Image src={"/images/search/icon1.svg"} alt="icon1" width={14} height={14} className="w-3.5 h-3.5" />
                        <div className="text-[#999]  text-2.75  font-500 lh-6 ml-1 mr1.25">芋圆</div>
                        </div>
                    <div className=" text-[#B5B5B5]  text-2.75 font-350 lh-6 ">03.03发布</div>
                    </div>
                </div>
            </div>
    )
}
export default Result;