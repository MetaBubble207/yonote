import Image from "next/image";

const Page = () => {
    return <div className={"w-375px bg-[#F5F7FB] relative"}>
        {/*顶部*/}
        {/*<div className={"flex w-100% h-22 shrink-0 bg-[#D9D9D9] absolute top-0 z-2"}>*/}
        {/*    /!*<div className={"w-6 h-6 shrink-0 text-center text-2xl mt-12 ml-4 lh-6"}>*!/*/}
        {/*    /!*    ×*!/*/}
        {/*    /!*</div>*!/*/}
        {/*    /!*<div className={"inline-block text-[#252525] text-5 font-not-italic font-500 lh-6 text-center mx-auto mt-12"}>*!/*/}
        {/*    /!*    心智与阅读*!/*/}
        {/*    /!*</div>*!/*/}
        {/*</div>*/}

        <div className={"w-full absolute top-0 z-2 "}>
            <div className={"flex justify-end items-center mt-16px"}>
                <div className={"inline-block w-14.25 h-6 text-[#252525] shrink-0 bg-#5CE5C1 text-2.5 font-500 lh-6 text-center rounded-10px"}>加速计划</div>
                <div className={"inline-block ml-10px mr-16px"}>
                    <Image src={"/images/special-column/Share-two (分享2).png"} alt={"心智与阅读"} width={12} height={12}/>
                </div>
            </div>
            <div className={"flex mb--50px mt-10px"}>
                <div className={"ml-20px mt--10px"}>
                    <Image src={"/images/special-column/Mask group.png"} alt={"心智与阅读"} width={111} height={156}/>
                </div>
                <div className={"flex flex-col ml-10px space-y-0"}>
                    <div className={"text-[#FFF] text-4.5 font-not-italic font-500 lh-6"}>心智与阅读</div>
                    <div className={"w-49.25 text-[#F2F2F2] text-3.5 font-not-italic font-400 lh-[120%] pt-5px"}>情绪价值波动，上上签，愤怒，变化，偏执，创造</div>
                    <div className={"flex pt-8px "}>
                        <Image src={"/images/special-column/Ellipse 2.png"} alt={"心智与阅读"} width={18} height={18}/>
                        <div className={"text-[#DFDFDF] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>芋圆</div>
                        <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12} height={12} className={"lh-0"} style={{ objectFit: "none", marginLeft:"5px"}}/>
                    </div>
                </div>

            </div>

            <div>

                {/*下方白色内容*/}
                <div className={" w-full  bg-#fff rounded-t-30px lh-6"}>

                    {/*订阅栏*/}
                    <div className={"ml-37.8% text-[#999] text-3 font-not-italic font-400 lh-6 pt-10px"}>
                        <span className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6 mr-5px"}>1090</span>
                        订阅
                        <span className={"shrink-0 text-[#252525] font-D-DIN text-4 font-not-italic font-700 lh-6 mr-5px ml-20px"}>1090</span>
                        内容
                    </div>

                    {/*介绍，内容*/}
                    <div className="flex mt-11px items-center">
                        <div className={"text-[#B5B5B5] text-3.5 font-not-italic font-400 lh-6 ml-16px"}>介绍</div>
                        <div className={"text-[#252525] text-3.5 font-not-italic font-500 lh-6 ml-40px"}>内容</div>
                        <div className="ml-auto mr-24px">
                            <Image src={"/images/special-column/Magnifying glass.png"} alt={"心智与阅读"} width={18} height={18}/>
                        </div>
                        <div className={"mr-16px"}>
                            <Image src={"/images/special-column/Sort.png"} alt={"心智与阅读"} width={18} height={18}/>
                        </div>
                    </div>

                    {/*四个标签*/}
                    <div className={"flex mt-23px"}>
                        <div className={"w-15 h-6 shrink-0 border-rd-1 bg-[rgba(69,225,184,0.20)] text-center ml-16px text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6" }>全部</div>
                        <div className={"w-15 h-6 shrink-0 bg-#F5F7FB ml-24px text-center text-[#999]  text-3.25 font-not-italic font-400 lh-6"}>免费</div>
                        <div className={"w-15 h-6 shrink-0 bg-#F5F7FB ml-24px text-center text-[#999]  text-3.25 font-not-italic font-400 lh-6"}>分类1</div>
                        <div className={"w-15 h-6 shrink-0 bg-#F5F7FB ml-24px text-center text-[#999]  text-3.25 font-not-italic font-400 lh-6"}>分类2</div>

                    </div>

                    {/*card1*/}
                    <div className={"w-91.5%  mt-20px ml-16px shrink-0 border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] px-10px"}>
                        {/*上边*/}
                        <div className={"flex mt-25.5px items-center"}>
                            {/*左边图片*/}
                            <div className={"border-rd-2"}>
                                <Image src={"/images/special-column/Cardpc.png"} alt={"小专栏图片"} width={85} height={74.5} className={"rounded-12px"}/>
                            </div>
                            {/*右边文字*/}
                            <div className={"ml-8px w-67% "}>
                                <div className={" text-[#252525] text-3.75 font-500 lh-6 text-3.75 pt-16.5px"}>
                                    「开播的第3年，P人沉浸于J人的世界」
                                    <span className={" shrink-0 border-rd-0.5 bg-[#FDB069] shrink-0 text-[#FFF]  text-2.5 font-not-italic font-500 lh-6 px-7px py-3px ml-10px"}>专栏</span>
                                    <span className={" shrink-0 border-rd-0.5 bg-[#75C3EE] shrink-0 text-[#FFF]  text-2.5 font-not-italic font-500 lh-6 px-7px py-3px ml-10px"}>置顶</span>
                                </div>

                                <div className={"text-[#666]  text-3.25 font-400 lh-[120%] pt-5px"}>情绪价值波动，上上签，愤怒，变化，偏执，创造</div>
                            </div>
                        </div>

                        {/*下方图标*/}
                        <div className="flex mt-18px items-center space-y-0 mb-22px">

                            {/*左边头像*/}
                            <div className={""}>
                                <div>
                                    <Image src={"/images/special-column/Ellipse 2.png"} alt={"心智与阅读"} width={23} height={23}/>
                                </div>
                            </div>
                            {/*昵称，日期，VIP*/}
                            <div>
                                <div className={"flex items-center"}>
                                    <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>芋圆</div>
                                    <div>
                                        <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12} height={12} className={"lh-0"} style={{  marginLeft:"2.5px"}}/>
                                    </div>
                                </div>
                                <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>03-01发布</div>

                            </div>

                            {/*右方点赞数量*/}
                            <div className="ml-auto flex items-center space-y-0">
                                <div>
                                    <Image src={"/images/special-column/heart 2.png"} alt={"爱心"} width={18} height={18} objectFit="none"/>
                                </div>
                                <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>1.2k</div>
                            </div>
                            {/*右方浏览数量*/}
                            <div className="ml-24px flex items-center space-y-0">
                                <div>
                                    <Image src={"/images/special-column/Preview-open (预览-打开).png"} alt={"爱心"} width={18} height={18} objectFit="none"/>
                                </div>
                                <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>1.2k</div>
                            </div>
                        </div>
                    </div>

                    {/*card2*/}
                    <div className={"w-91.5% mt-20px ml-16px shrink-0 border-rd-5 border-1 border-solid border-[rgba(181,181,181,0.20)] bg-[#FFF] px-10px"}>
                        {/*上方文字*/}
                        <p className={"text-[#252525] text-3.75 font-not-italic font-500 lh-6 text-3.75 pt-16.5px"}>「开播的第3年，P人沉浸于J人的世界时间我是乱打的」</p>
                        <p className={"text-[#666]  text-3.25 font-not-italic font-400 lh-[120%] pt-5px"}>情绪价值波动，上上签，愤怒，变化，偏执，创造 情绪价值波动，上上签，愤怒，变化，偏执，创造 </p>

                        {/*下方图标*/}
                        <div className="flex mt-18px items-center space-y-0 mb-22px">

                            {/*左边头像*/}
                            <div className={""}>
                                <div>
                                    <Image src={"/images/special-column/Ellipse 2.png"} alt={"心智与阅读"} width={23} height={23}/>
                                </div>
                            </div>
                            {/*昵称，日期，VIP*/}
                            <div>
                                <div className={"flex items-center"}>
                                    <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>芋圆</div>
                                    <div>
                                        <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12} height={12} className={"lh-0"} style={{  marginLeft:"2.5px"}}/>
                                    </div>
                                </div>
                                <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>03-01发布</div>

                            </div>

                            {/*右方点赞数量*/}
                            <div className="ml-auto flex items-center space-y-0">
                                <div>
                                    <Image src={"/images/special-column/heart 2.png"} alt={"爱心"} width={18} height={18} objectFit="none"/>
                                </div>
                                <div className={"text-[#B5B5B5] text-2.75 font-not-italic font-500 lh-6 ml-4px"}>1.2k</div>
                            </div>
                            {/*右方浏览数量*/}

                        </div>
                    </div>

                    {/*按钮*/}
                    <div className={"w-91% h-40px shrink-0 border-rd-11.25 bg-[#5CE5C1] ml-16px mt-17px mb-36px text-center lh-40px text-[#252525] text-4.5 font-not-italic font-500"}>
                        订阅
                    </div>
                </div>



            </div>

        </div>
        <div className={"absolute top-0 z-1 filter blur-sm"}>
            <Image src={"/images/special-column/Cardpc.png"} alt={"bg"} width={375} height={74.5}/>
            <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
    </div>
}

export default Page;