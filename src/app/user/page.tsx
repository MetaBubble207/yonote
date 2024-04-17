// page.tsx
import Image from "next/image";
import React from "react";

function User() {
    return (
        // 背景颜色
        <div className="bg-gradient-to-rb from-custom-user_gradient_1 via-custom-user_gradient_2 to-custom-user_gradient_3 w-screen h-screen">
            {/* 顶部 */}
            <div className="pl-4 pt-9">
                <div className="flex flex-row items-center">
                    <Image src="/images/user/avatar.svg" alt="avatar" width={83} height={83} className="my-4" />

                    {/* 用户信息 */}
                    <div className="ml-3 flex-1">
                        <div className="flex align-center">
                            <h1 className="w-10 text-[#252525] text-4.5 font-500 lh-6">芋圆</h1>
                            <Image src="/images/user/Group.png" alt="group" width={20} height={20} className="ml-2" />
                        </div>
                        <div className="flex items-center">
                            <div className="logo flex w-3.5 h-3.5 items-center">
                                <Image src="/images/user/I_logo.svg" alt="group" width={7.44} height={7.44}
                                    className="w-1.4775 h-1.86 shrink-0 fill-#666" />
                                <Image src="/images/user/D_logo.svg" alt="group" width={7.44} height={7.44}
                                    className="w-1.4775 h-1.86 shrink-0 fill-#666" />
                            </div>
                            <span
                                className="ml-1 w-18 text-[#999] font-Source Han Sans SC text-2.5 font-not-italic font-400 lh-6 items-center">1317wfa2</span>
                        </div>

                    </div>

                    {/* 编辑资料 */}
                    <div
                        className="w-20 text-[#252525] text-2.5 font-500 lh-6 rounded-xl mr-4 flex flex-row bg-white pl-2.5 items-center ">
                        <Image src="/images/user/icon_edit.png" alt="icon" width={14} height={14}
                            className="w-4 h-4 mr-1" />
                        <a href="#">编辑资料</a>
                    </div>
                </div>
            </div>


            {/* 专栏、小课区域 */}
            <div className="w-85.75 h-63.75 border-rd-2.5 bg-#FFF ml-4 pl-4 pt-4 mt-4">
                {/* 导航区域 */}
                <div className="flex">
                    <a href="#"
                        className="w-7 h-6 mr-8 text-[#B5B5B5] font-source-han-sans-sc text-sm font-normal leading-6">专栏</a>
                    <div className={"flex-col"}>
                        <a href="#"
                           className="text-[#252525] text-3.5 font-500 lh-6">小课</a>
                        <div className={"ml-2.25 mt-1 w-2.75 h-1 border-rd-2 bg-[#45E1B8]"}></div>
                    </div>

                </div>

                {/* 内容区域 */}
                <div>
                    <div className="flex h-14 mt-6">
                        <Image src="/images/user/cover.svg" alt="icon" width={14} height={14} className="w-15.5 h-19" />
                        <div>
                            <h2 className={"ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"}>「心智与阅读」</h2>
                            <p className={"w-59.25 text-[#666] font-\"Source Han Sans SC\" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2"}>情绪价值波动，上上签，愤怒，变化，偏执，创造</p>
                        </div>
                    </div>
                    <div className="flex h-14 mt-8">
                        <Image src="/images/user/cover.svg" alt="icon" width={14} height={14} className="w-15.5 h-19" />
                        <div>
                            <h2 className={"ml-2 w-33.81125 text-[#252525] text-3.75 font-500 lh-6"}>「心智与阅读」</h2>
                            <p className={"w-59.25 text-[#666] font-\"Source Han Sans SC\" text-3.25 font-not-italic font-400 lh-[120%] ml-3 mt-2"}>情绪价值波动，上上签，愤怒，变化，偏执，创造</p>
                        </div>
                    </div>
                </div>



            </div>

            {/*  我的服务模块*/}
            <div className={"w-85.75 h-51.5 border-rd-2.5 bg-[#FFF] mx-auto mt-1.5  pt-4.5"}>
                {/*标题*/}
                <h2 className={"text-[#252525] text-3.5 font-500 lh-6 pl-5.5"}>我的服务</h2>

                <div className="service">
                    <ul className={"flex flex-wrap"}>
                        <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                            <a href="#" className="flex flex-col items-center">
                                <Image src={'/images/user/HomePage.svg'} alt={"个人主页"} width={"48"} height={"48"}
                                    className={"w-6 h-6"} />
                                <p className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}>个人主页</p>
                            </a>
                        </li>
                        <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                            <a href="#" className="flex flex-col items-center">
                                <Image src={'/images/user/KnowledgePlanet.svg'} alt={"知识星球"} width={"48"} height={"48"}
                                    className={"w-6 h-6"} />
                                <p className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}>知识星球</p>
                            </a>
                        </li>
                        <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                            <a href="#" className="flex flex-col items-center">
                                <Image src={'/images/user/Usage.svg'} alt={"使用说明"} width={"48"} height={"48"}
                                    className={"w-6 h-6"} />
                                <p className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}>使用说明</p>
                            </a>
                        </li>
                        <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                            <a href="#" className="flex flex-col items-center">
                                <Image src={'/images/user/Income.svg'} alt={"收入提现"} width={"48"} height={"48"}
                                    className={"w-6 h-6"} />
                                <p className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}>收入提现</p>
                            </a>
                        </li>
                        <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                            <a href="#" className="flex flex-col items-center">
                                <Image src={'/images/user/Feedback.svg'} alt={"意见反馈"} width={"48"} height={"48"}
                                    className={"w-6 h-6"} />
                                <p className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}>意见反馈</p>
                            </a>
                        </li>
                        <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                            <a href="#" className="flex flex-col items-center">
                                <Image src={'/images/user/Contact.svg'} alt={"联系客服"} width={"48"} height={"48"}
                                    className={"w-6 h-6"} />
                                <p className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}>联系客服</p>
                            </a>
                        </li>
                        <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                            <a href="#" className="flex flex-col items-center">
                                <Image src={'/images/user/SignOut.svg'} alt={"退出登录"} width={"48"} height={"48"}
                                    className={"w-6 h-6"} />
                                <p className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}>退出登录</p>
                            </a>
                        </li>





                    </ul>
                </div>

            </div>
        </div>

    )
}


export default User;