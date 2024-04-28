import Compass from "@/app/_components/writer/compass";
import Page_customized from "@/app/writer/pagination/page";
import Image from "next/image";
import React from "react";
import MySlider from "@/app/writer/slider/page";
import Date from "@/app/writer/datarange/page";
import LeftCompass from "@/app/_components/writer/left_compass";


const Page = () => {
    return (
        <div>
            <Compass></Compass>
            <div className='flex'>
                {/*左边 侧边导航*/}
                {/*<div className="w-65.25 h-225 shrink-0 bg-[#FFF]">侧边导航</div>*/}
                <LeftCompass />

                {/*右边 加速计划*/}
                <div className='mt-4 ml-4 pl-8 pt-8 w-286.75 h-203.5 shrink-0 border-rd-[0px_0px_10px_10px] bg-[#FFF]'>
                    <div className='w-271.75 h-126.605 shrink-0 '>
                        <h3 className='text-[#323232] text-4 font-700 lh-6'>加速计划</h3>
                        {/*加速激励*/}
                        <div className='pl-2 mt-6.0525'>
                            <h4 className='w-17.66225 h-5.5 shrink-0 text-[rgba(0,0,0,0.85)] text-4 font-400 lh-6'>加速激励</h4>
                            {/*输出条*/}
                            <div className='ml-11.25'>
                                <MySlider/>
                            </div>

                            {/*激励榜单*/}
                            <div className='mt-8'>
                                <h3 className='w-17.75 h-5.5 shrink-0 text-[rgba(0,0,0,0.85)] text-4 font-400 lh-6'>激励榜单</h3>
                                <div className='flex'>
                                    <div className='flex mt-7.425 items-center'>
                                        <label
                                            className='ml-10.5575 text-[rgba(0,0,0,0.85)] text-3.5 font-400 lh-5.5'>用户ID: </label>
                                        <input
                                            className='pl-3.0425  ml-4  w-56 h-8  shrink-0 border-rd-1 outline-none border-1 border-solid border-[#D9D9D9] bg-[#FFF]'
                                            type="text" placeholder="用户ID"/>
                                        <div className='ml-20.5'>
                                            <Date></Date>
                                        </div>

                                        <button
                                            className='ml-75 w-20.5 h-8 shrink-0 border-rd-1 bg-[#1DB48D]  text-[#FFF] text-3.5 font-400 lh-5.5'>数据导出
                                        </button>
                                    </div>

                                </div>


                            </div>

                            {/*排行榜*/}
                            <div className='mt-4.18 '>
                                <table
                                    className='table-auto w-269.75 h-13.5 shrink-0 border-rd-[4px_4px_0px_0px] bg-[#FAFAFA] lh-13.5 text-[rgba(0,0,0,0.85)] text-3.5 font-400 '>
                                    <thead>
                                    <tr>
                                        <th>排名</th>
                                        <th>用户头像</th>
                                        <th>用户名</th>
                                        <th>用户ID</th>
                                        <th className={'flex justify-center items-center'}>
                                            <span>加速量</span>
                                            <div className='ml-1.25'>
                                                <button className='flex '>
                                                    <Image src={'/images/writer/up.svg'} alt={'up'} width={6.65}
                                                           height={4.27}/>
                                                </button>
                                                <button className='flex '>
                                                    <Image src={'/images/writer/down.svg'} alt={'down'} width={6.65}
                                                           height={4.27}/>
                                                </button>
                                            </div>
                                        </th>
                                        <th>
                                            <div className='flex justify-center items-center'>
                                                <span>总金额</span>
                                                <div className='ml-1.25 flex-col justify-center'>
                                                    <button className='flex'>
                                                        <Image src={'/images/writer/up.svg'} alt={'up'}
                                                               width={6.65}
                                                               height={4.27}/>
                                                    </button>
                                                    <button className='flex'>
                                                        <Image src={'/images/writer/down.svg'} alt={'down'}
                                                               width={6.65}
                                                               height={4.27}/>
                                                    </button>


                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                    <tr className='border-t solid'>
                                        <td>1</td>
                                        <td className='relative'><Image
                                            className=' w-8 h-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 border-rd-8'
                                            src={'/images/writer/avatar1.svg'} alt={'avatar1'} width={32} height={32}/>
                                        </td>
                                        <td>胖头鱼吃瓜</td>
                                        <td>1239f4</td>
                                        <td>50</td>
                                        <td>￥<span>234</span></td>
                                    </tr>
                                    <tr className='border-t solid'>
                                        <td>2</td>
                                        <td className='relative'><Image
                                            className=' w-8 h-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 border-rd-8'
                                            src={'/images/writer/avatar2.svg'} alt={'avatar2'} width={32} height={32}/>
                                        </td>
                                        <td>名字太长限制...</td>
                                        <td>1239f4</td>
                                        <td>50</td>
                                        <td>￥<span>234</span></td>
                                    </tr>
                                    <tr className='border-t solid'>
                                        <td>3</td>
                                        <td className='relative'><Image
                                            className=' w-8 h-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 border-rd-8'
                                            src={'/images/writer/avatar3.svg'} alt={'avatar3'} width={32} height={32}/>
                                        </td>
                                        <td>闲着没事找事...</td>
                                        <td>1239f4</td>
                                        <td>50</td>
                                        <td>￥<span>234</span></td>
                                    </tr>
                                    <tr className='border-t solid'>
                                        <td>4</td>
                                        <td className='relative'><Image
                                            className=' w-8 h-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 border-rd-8'
                                            src={'/images/writer/avatar4.svg'} alt={'avatar4'} width={32}
                                            height={32}/></td>
                                        <td>随便打一下</td>
                                        <td>1239f4</td>
                                        <td>50</td>
                                        <td>￥<span>234</span></td>
                                    </tr>

                                    </tbody>

                                </table>


                            </div>

                            <div className="mt-4 flex flex-col justify-end items-center">
                                <Page_customized/>
                            </div>

                        </div>

                    </div>


                </div>
            </div>


        </div>
    )
}
export default Page