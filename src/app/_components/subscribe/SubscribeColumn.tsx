import Image from "next/image";
import Link from "next/link";

const SubscribeColumn = () => {
    return (
        <Link href={'/'}>
            <div className="h-29.25 mt-4 flex">
                <div className="relative h-18">
                    <Image src={"/images/subscribe/user1.png"} alt="user_image" width={24} height={24} className="w-11.25 h-11.25 mt-4"></Image>
                    <div className="bottom-2 right-1 absolute">
                        <Image src={"/images/subscribe/vip.svg"} alt="vip" width={12} height={12} className="w-3 h-3"></Image>
                    </div>
                    <div className="text-center text-[#999]  font-500 lh-9.6">芋圆</div>
                </div>
                <div className="flex-1">
                    <div className="text-2.75 lh-4 text-[#B5B5B5] ml-2.6">3.02 12:30发布</div>
                    <div className="border-rd-[2px_16px_16px_16px] bg-[#FFF] h-24 mt-1 ml-2 flex items-center">
                        <div className="w-49.75 pl-2.5 ">
                            <div className="text-[#252525] text-3.75 font-500 lh-6">「心智与阅读」</div>
                            <div className="pt-2 text-[#666] text-3.25">情绪价值，上上签，愤怒，变化，偏执，创造</div>
                        </div>
                        <Image src={"/images/subscribe/cover.png"} alt="cover" width={24} height={24} className="w-15.5 h-19 ml-3"></Image>
                    </div>
                </div>
            </div>
        </Link>

    )
}
export default SubscribeColumn;