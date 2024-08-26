import Image from "next/image"
import ResultVip from "../_components/search/ResultVip";
import Result from "../_components/search/Result";

const Page = () => {
    return <div className="min-h-screen relative">
        <div className=" w-85.75 mt-8 ml-4">
            {/*搜索栏和取消*/}
            <div className="flex justify-between items-center w-85.75">
                <div className="border-rd-13 h-8.5 w-73.75 bg-[#f5f7fb] flex items-center">
                    <Image src={"/images/search/search.svg"} alt="search" width={18} height={18}
                           className="inline ml-5.25 w-4.5 h-4.5"/>
                    <input type="text" placeholder="心智阅读"
                           className="text-3.25 text-[#252525] lh-8 ml-1.6 w-62.5 h-7.5 pl-1 bg-transparent outline-none "></input>
                </div>
                <div className="text-3.75 text-[#252525] lh-6 w-8.25 h-5.5 ">取消</div>
            </div>
            <ResultVip/>
            <Result/>
        </div>
    </div>
}


export default Page;