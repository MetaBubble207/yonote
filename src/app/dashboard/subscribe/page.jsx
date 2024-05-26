import Navbar from "../../_components/common/Navbar"
import Image from "next/image";
import Link from "next/link";
import Page from "../../_components/subscribe/Navscribr";


const Subscribe = () => {
    return (
        <div className="min-h-screen relative pb-10">
            <div className="w-85.75 mt-8 m-auto mb-2">
                <div className="border-rd-13 h-8.5 bg-[#FFF] flex items-center">
                    <Image src={"/images/subscribe/search.png"} alt="search" width={18} height={18} className="inline  ml-5.25 w-4.5 h-4.5"></Image>
                    <input type="search" name="" id="" placeholder="仅支持搜索专栏和作者" className="text-3.25 text-[#999] lh-8.5 ml-1.6 justify-center outline-none w-full h-8.5 pl-1.6 border-rd-13 " ></input>
                </div>

                <div className="h-20.5 w-full mt-8 border-rd-2.5 bg-[#FFF] flex items-center relative">
                    <Image src={"/images/subscribe/cover.png"} alt="cover" width={18.2} height={24.8} className="w-11.375 h-15.5 ml-4"></Image>
                    <div className="pl-2 relative h-23 pt-3">
                        <div className="text-3 text-[#252525] font-500 pb-1.5 lh-6">「显示不够的话开播的第3年，P人沉...」</div>
                        <div className="text-2.5 text-[#666] lh-3 pl-1">显示多少然后开始了...</div>
                    </div>
                    <Link href={"../special-column-content"} className="w-18.25 h-7.75 text-3 bg-[#daf9f1] text-[#1db48d] lh-7.75 text-center border-rd-12 absolute right-2.5 bottom-2.5">继续阅读</Link>
                </div>

                <div>
                    <Page />
                </div>
            </div>

            <div className="bottom-4 justify-center w-full fixed">
                <Navbar />
            </div>
            {/*<div className="h-14"></div>*/}
        </div >
    )
}
export default Subscribe;
