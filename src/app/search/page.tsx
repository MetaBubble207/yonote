import Image from "next/image"
import Navbar from "../_components/common/Navbar";

/*import Page from           */


const Page=()=>{
    return <div className="min-h-screen relative">
        <div className=" w-85.75 mt-8 ml-4">
            {/*搜索栏和取消*/}  
            <div className="flex justify-between items-center w-85.75">
                <div className="border-rd-13 h-8.5 w-73.75 bg-[#f5f7fb] flex items-center">
                    <Image src={"/images/search/search.svg"} alt="search" width={18} height={18} className="inline ml-5.25 w-4.5 h-4.5" />
                    <div className="text-3.25 text-[#252525] lh-8 ml-1.6 w-32.5 h-7.5 pl-1 border-rd-13">心智阅读</div>
                </div>
                
                <div className="text-3.75 text-[#252525] lh-6 w-8.25 h-5.5 ">取消</div>
                
            </div>


            {/*搜索结果-vip*/}
            <div className="h-23 w-full mt-6 bg-[#FFF] flex items-start">  
            <div className="flex items-start">
                {/* 封面*/}
                <Image src={"/images/search/cover.svg"} alt="cover" width={18.2} height={24.8} className="w-17.25 h-23" />
                <div className="pl-3 flex flex-col">
                    {/* 标题 */}
                    <div className="text-[#252525] text-3.75 font-500 lh-6">「心智与阅读系列：和人家啊已经 是豪丝娜的」</div>
                    {/* 图标、用户名、vip图标*/}
                    <div className="flex items-center">
                        <Image src={"/images/search/icon1.svg"} alt="icon1" width={14} height={14} className="w-3.5 h-3.5" />
                        <div className="text-[#999]  text-2.75  font-500 lh-6 ml-1 mr1.25">芋圆</div>
                        <Image src={"/images/search/vip.svg"} alt="vip" width={12} height={12} className="w-3 h-3" />
                        </div>
                    {/* 日期*/}
                    <div className=" text-[#B5B5B5]  text-2.75 font-350 lh-6 ">03.03发布</div>
                    </div>
                </div>
            </div>


            {/*搜索结果-普通用户*/}
            <div className="h-23 w-full mt-6 bg-[#FFF] flex items-start">  
            <div className="flex items-start">
                {/* 封面*/}
                <Image src={"/images/search/cover.svg"} alt="cover" width={18.2} height={24.8} className="w-17.25 h-23" />
                <div className="pl-3 flex flex-col">
                    {/* 标题 */}
                    <div className="text-[#252525] text-3.75 font-500 lh-6">「心智与阅读系列：和人家啊已经 是豪丝娜的」</div>
                    {/* 图标、用户名*/}
                    <div className="flex items-center">
                        <Image src={"/images/search/icon1.svg"} alt="icon1" width={14} height={14} className="w-3.5 h-3.5" />
                        <div className="text-[#999]  text-2.75  font-500 lh-6 ml-1 mr1.25">芋圆</div>
                        </div>
                    {/* 日期*/}
                    <div className=" text-[#B5B5B5]  text-2.75 font-350 lh-6 ">03.03发布</div>
                    </div>
                </div>
            </div>












            













        

            

        
















        </div>
    </div>
}


export default Page;