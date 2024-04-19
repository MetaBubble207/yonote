import Image from "next/image";

const Page =()=>{
    return (
        <div className="min-h-screen relative bg-#F5F7FB pt-8">
            <div className="flex items-center w-full h-6 ml-4">              
                <div className="flex w-14 h-6 text-[#252525] text-3.5 font-500 lh-6">专栏推荐</div>                   
                <div className="flex ml-10 w-14 h-6 text-[#B5B5B5] text-3.5 font-400 lh-6">有记小课</div>
                <div className="flex ml-10 w-14 h-6 text-[#B5B5B5] text-3.5 font-400 lh-6 ">共创计划</div>
            </div>
            <div className="w-2.75 h-1 border-rd-2 bg-[#45E1B8] ml-9.5 mt-0.75"></div>

            
            <div className="flex w-full h-6 ml-4 mt-6">
                <div className="flex w-10.75  justify-center items-center gap-2 border-rd-1 bg-[rgba(69,225,184,0.20)] text-[#1DB48D] text-3.25 font-400 lh-6">默认</div>
                <div className="flex w-13.75 justify-center items-center gap-2 border-rd-1 bg-[#FFF] text-[#999] text-3.25 font-400 lh-6 ml-2">订阅量</div>
                <div className="flex w-13.75 justify-center items-center gap-2 border-rd-1 bg-[#FFF] text-[#999] text-3.25 font-400 lh-6 ml-2">内容量</div>
                <div className="flex w-17 justify-center items-center gap-2 border-rd-1 bg-[#FFF] text-[#999] text-3.25 font-400 lh-6 ml-2">最近发布</div>
                <div className="flex w-17 justify-center items-center gap-2 border-rd-1 bg-[#FFF] text-[#999] text-3.25 font-400 lh-6 ml-2">创作时间</div>
            </div>

            <div className="flex ">
                <div className="ml-4 mt-2 text-[#B5B5B5] text-2.5 font-400 lh-6">默认倒序排序</div>
                <Image src={"/images/recommend/sort.svg"} alt={"sort"} width={12} height={12} className="w-3 h-3 mt-3.5 ml-1.25"/>
            </div>
            


         

            {/*列表1*/}
            <div className="w-85.75 h-33.75 border-rd-5 bg-[#FFF] ml-4 mt-4">
                <div className="flex h-19 pl-2.5 pt-2">
                    <Image src={"/images/recommend/cover.svg"} alt="cover" width={24} height={24} className="w-15.5 h-19"></Image>
                    <div className="w-64.25 h-16  mt-1 ml-3">
                        <div className="text-[#252525] text-3.75 font-500 lh-6 ">「心智与阅读」</div>                
                        <div className="text-[#666] text-3.25 font-400 lh-[120%] mt-2">情绪价值波动，上上签，愤怒，变化，偏执，创造</div>
                    </div>
                </div>
                <div className="mt-3 ml-3 flex w-full h-9.5 items-center flex-shrink-0">
                    <Image src={"/images/subscribe/user1.png"} alt="user_image" width={24} height={24} className="w-5.75 h-5.75"></Image>
                    <div className="ml-1 w-43">
                        
                        <div className="flex text-[#999] text-2.75 lh-4">芋圆</div>              
                        
                        <div className="text-[#B5B5B5] text-2.75 lh-4">03-01发布</div>
                    </div>
                    <div className="flex-1 flex items-center">
                        <Image src={"/images/recommend/rss.svg"} alt="rss" width={5} height={5} className="w-4.5 h-4.5 "></Image>
                        <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">1.2k</div>
                        <Image src={"/images/recommend/open.svg"} alt="open" width={5} height={5} className=" w-4.5 h-4.5 ml-7"></Image>
                        <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">1.2k</div>
                    </div>
                </div>
            </div >

            {/*列表2*/}
            <div className="w-85.75 h-33.75 border-rd-5 bg-[#FFF] ml-4 mt-2">
                <div className="flex h-19 pl-2.5 pt-2">
                    <Image src={"/images/recommend/cover.svg"} alt="cover" width={24} height={24} className="w-15.5 h-19"></Image>
                    <div className="w-64.25 h-16  mt-1 ml-3">
                        <div className="text-[#252525] text-3.75 font-500 lh-6 ">「心智与阅读」</div>                
                        <div className="text-[#666] text-3.25 font-400 lh-[120%] mt-2">情绪价值波动，上上签，愤怒，变化，偏执，创造</div>
                    </div>
                </div>
                <div className="mt-3 ml-3 flex w-full h-9.5 items-center flex-shrink-0">
                    <Image src={"/images/subscribe/user1.png"} alt="user_image" width={24} height={24} className="w-5.75 h-5.75"></Image>
                    <div className="ml-1 w-43">
                        
                        <div className="flex text-[#999] text-2.75 lh-4">芋圆</div>              
                        
                        <div className="text-[#B5B5B5] text-2.75 lh-4">03-01发布</div>
                    </div>
                    <div className="flex-1 flex items-center">
                        <Image src={"/images/recommend/rss.svg"} alt="rss" width={5} height={5} className="w-4.5 h-4.5 "></Image>
                        <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">1.2k</div>
                        <Image src={"/images/recommend/open.svg"} alt="open" width={5} height={5} className=" w-4.5 h-4.5 ml-7"></Image>
                        <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">1.2k</div>
                    </div>
                </div>
            </div >
           
                     

        </div>
        
        
        
    )
}
export default Page;