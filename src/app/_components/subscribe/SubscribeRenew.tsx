import Image from "next/image";
import Link from "next/link";

const SubscribeRenew = () => {
    return (
        <Link href={"../special-column-content"}>
            <div className="w-85.75 h-42.75 border-rd-5 bg-[#FFF] mb-2">
                <div className="flex h-27 pl-2.5 pt-2.5">
                    <Image src={"/images/subscribe/cover.png"} alt="cover" width={24} height={24} className="w-20.25 h-27"></Image>
                    <div className="w-57.5 h-21.25 mt-2 ml-3">
                        <div className="text-[#252525] text-3.75 font-500 lh-6 ">「开播的第3年，P人沉浸于J人的世界」</div>
                        <div className="text-[#666] text-3.25 font-400 lh-[120%]">情绪价值波动，上上签，愤怒，变化，偏执，创造</div>
                    </div>
                </div>
                <div className="mt-3.5 ml-3 flex w-full h-9.5 items-center flex-shrink-0">
                    <Image src={"/images/subscribe/user1.png"} alt="user_image" width={24} height={24} className="w-5.75 h-5.75"></Image>
                    <div className="ml-1 w-43">
                        <div className="flex items-center">
                            <div className="text-[#999] text-2.75 lh-4">芋圆</div>
                            <Image src={"/images/subscribe/vip.svg"} alt="cover" width={24} height={24} className="w-3 h-3 ml-1.2"></Image>
                        </div>
                        <div className="text-[#B5B5B5] text-2.75 lh-4">03-01发布</div>
                    </div>
                    <div className="flex-1 flex items-center">
                        <Image src={"/images/subscribe/like.svg"} alt="leke" width={5} height={5} className="w-4.5 h-4.5 "></Image>
                        <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">1.2k</div>
                        <Image src={"/images/subscribe/see.svg"} alt="leke" width={5} height={5} className=" w-4.5 h-4.5 ml-7"></Image>
                        <div className="text-[#B5B5B5] text-2.75 font-500 lh-6 ml-1">1.2k</div>
                    </div>
                </div>
            </div >
        </Link>

    )
}
export default SubscribeRenew;