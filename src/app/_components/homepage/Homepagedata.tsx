import Image from "next/image";
import Link from "next/link";
const Homepagedata = () => {
    return (
        <div className="w-full h-82 pl-32px r-16px bg-[#FFF] border-rd-2.5">
            <div className="flex items-center pt-34px">
                <span className="text-[#323232] text-4 font-700 lh-6">主板看板</span>
                <Link href={'../edit/edit'} className="w-20.5 h-8 color-[#1db48d] bg-[#dbf9f1] pl-17px pt-4px ml-32px">+ 发布</Link>
            </div>

            <div className="pt-24px flex">
                <div className="w-87 h-52 shrink-0 border-rd-2.5 border-1 border-solid border-[#ECECEC] bg-[#FFF]">
                    <ul className="flex items-center text-center mt-60.7px text-4 font-700 lh-6 text-[rgba(0,0,0,0.65)]">
                        <li className="flex-1 text-[#323232] text-3.5 font-400">阅读量</li>
                        <li className="flex-1">1010</li>
                        <li className="flex-1">1010</li>
                        <li className="flex-1">1010</li>
                    </ul>
                    <ul className="flex text-center text-[rgba(153,153,153,0.60)] text-3.5 lh-6">
                        <Image src={"/images/homepage/readding.svg"} alt={"accelerate"} width={53} height={53} className="inline-block ml-13.77px mr-15px"></Image>
                        <li className="flex-1">昨日(次)</li>
                        <li className="flex-1">昨日(次)</li>
                        <li className="flex-1">昨日(次)</li>
                    </ul>
                    <div className="relative top--5px left-113.26px flex items-center">
                        <Image src={"/images/homepage/Arrow-left-down.svg"} alt="arrow" width={20} height={20}></Image>
                        <span className="text-[#4CC5A6] text-3 font-700 lh-6 ml-10.48px">-0.19%相较昨天</span>
                    </div>
                </div>



                <div className="w-87 h-52 shrink-0 border-rd-2.5 border-1 border-solid border-[#ECECEC] bg-[#FFF] ml-18px">
                    <ul className="flex items-center text-center mt-60.7px text-4 font-700 lh-6 text-[rgba(0,0,0,0.65)]">
                        <li className="flex-1 text-[#323232] text-3.5 font-400">订阅量</li>
                        <li className="flex-1">1010</li>
                        <li className="flex-1">1010</li>
                        <li className="flex-1">1010</li>
                    </ul>

                    <ul className="flex text-center text-[rgba(153,153,153,0.60)] text-3.5 lh-6">
                        <Image src={"/images/homepage/subscribe.svg"} alt={"accelerate"} width={53} height={53} className="inline-block ml-13.77px mr-15px"></Image>
                        <li className="flex-1">昨日(次)</li>
                        <li className="flex-1">昨日(次)</li>
                        <li className="flex-1">昨日(次)</li>
                    </ul>
                    <div className="relative top--5px left-113.26px flex items-center">
                        <Image src={"/images/homepage/Arrow-left-down.svg"} alt="arrow" width={20} height={20}></Image>
                        <span className="text-[#4CC5A6] text-3 font-700 lh-6 ml-10.48px">-0.19%相较昨天</span>
                    </div>
                </div>




                <div className="w-87 h-52 shrink-0 border-rd-2.5 border-1 border-solid border-[#ECECEC] bg-[#FFF] ml-18px">
                    <ul className="flex items-center text-center mt-60.7px text-4 font-700 lh-6 text-[rgba(0,0,0,0.65)]">
                        <li className="flex-1 text-[#323232] text-3.5 font-400">加速计划</li>
                        <li className="flex-1">1010</li>
                        <li className="flex-1">1010</li>
                        <li className="flex-1">1010</li>
                    </ul>
                    <ul className="flex text-center text-[rgba(153,153,153,0.60)] text-3.5 lh-6">
                        <Image src={"/images/homepage/accelerate.svg"} alt={"accelerate"} width={53} height={53} className="inline-block ml-13.77px mr-15px"></Image>
                        <li className="flex-1">昨日(次)</li>
                        <li className="flex-1">昨日(次)</li>
                        <li className="flex-1">昨日(次)</li>
                    </ul>
                    <div className="relative top--5px left-113.26px flex items-center">
                        <Image src={"/images/homepage/Arrow-right-up.svg"} alt="arrow" width={20} height={20}></Image>
                        <span className="text-[#4CC5A6] text-3 font-700 lh-6 ml-10.48px">-0.19%相较昨天</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Homepagedata;
