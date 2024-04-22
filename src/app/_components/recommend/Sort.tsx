import exp from "constants"
import Image from "next/image"

const Sort =()=> {
    return(
        <div>          
            <div className="flex w-full h-6 ">
                <button className=" w-10.75">
                    <div className="flex justify-center items-center gap-2 border-rd-1 bg-[rgba(69,225,184,0.20)] text-[#1DB48D] text-3.25 font-400 lh-6">默认</div>
                </button>
                <button className="w-13.75">
                    <div className="flex justify-center items-center gap-2 border-rd-1 bg-[#FFF] text-[#999] text-3.25 font-400 lh-6 ml-2">订阅量</div>
                </button>
                <button className="w-13.75">
                    <div className="flex justify-center items-center gap-2 border-rd-1 bg-[#FFF] text-[#999] text-3.25 font-400 lh-6 ml-2">内容量</div>
                </button>
                <button className=" w-17">
                    <div className="flex justify-center items-center gap-2 border-rd-1 bg-[#FFF] text-[#999] text-3.25 font-400 lh-6 ml-2">最近发布</div>
                </button>
               <button className="w-17">
                    <div className="flex  justify-center items-center gap-2 border-rd-1 bg-[#FFF] text-[#999] text-3.25 font-400 lh-6 ml-2">创作时间</div>
               </button>               
            </div>

            <div className="flex">
                <div className=" mt-2 text-[#B5B5B5] text-2.5 font-400 lh-6">默认倒序排序</div>
                <button>
                    <Image src={"/images/recommend/sort.svg"} alt={"sort"} width={12} height={12} className="w-3 h-3 mt-1.5 ml-1.25"/>
                </button>
                
            </div>
        </div>

        
    )
}
export default Sort;