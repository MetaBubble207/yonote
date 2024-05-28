'use client'
import Image from "next/image";
import React, {useState} from "react";
import MySlider from "@/app/_components/slider/page";
import Date from '../../_components/datarange/Date'
import MyPagination from "@/app/_components/pagination/page";
import { Slider } from 'antd';
import type { SliderSingleProps } from 'antd';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
const Page = () => {
    const distribution: SliderSingleProps['marks'] = {
        0: '0%',
        10: '10%',
        20: '20%',
        30: '30%',
        40: '40%',
        50: '50%',
        60: '60%',
        70: '70%',
      };
    const acceleration: SliderSingleProps['marks'] = {
        0: '0%',
        10: '10%',
        20: '20%',
        30: '30%',
    }
    const onChange = (key: string | string[]) => {
        console.log(key);
      };


    const item: CollapseProps['items'] = [
    {
        key: '1',
        label: '分销激励',
        children: <Slider marks={distribution} step={null} defaultValue={37} max={70} />,
    },
    {
        key: '2',
        label: '加速激励',
        children: <Slider marks={acceleration} step={null} defaultValue={37} max={30} />,
    },
    ];
    interface Item {
        ranking: number;
        avatar: string;
        username: string;
        userId: string;
        acceleration: number;
        totalAmount: number;
    }
   
     
    const items: Item[] = [
        {
            ranking: 1,
            avatar: '/images/writer/avatar1.svg',
            username: '胖头鱼吃瓜',
            userId: '1239f4',
            acceleration: 50,
            totalAmount: 234
        },{
            ranking: 1,
            avatar: '/images/writer/avatar2.svg',
            username: '名字太长限制...',
            userId: '1239f4',
            acceleration: 50,
            totalAmount: 234
        },{
            ranking: 1,
            avatar: '/images/writer/avatar3.svg',
            username: '闲着没事找事...',
            userId: '1239f4',
            acceleration: 50,
            totalAmount: 234
        },{
            ranking: 1,
            avatar: '/images/writer/avatar4.svg',
            username: '随便打一下',
            userId: '1239f4',
            acceleration: 50,
            totalAmount: 234
        },
    ]

    const [userId,setUserId] = useState<string>('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        console.log(`查询: ${e.target.value}`)
        setUserId(e.target.value)
    }
    const ItemList: React.FC = () => {

        return (
            <tbody className='text-center'>
            {items.map((item, index) => (
                <tr key={index} className='border-t solid'>
                    <td>{item.ranking}</td>
                    <td className='relative'><Image
                        className=' w-8 h-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 border-rd-8'
                        src={item.avatar} alt={'avatar'} width={32} height={32}/>
                    </td>
                    <td>{item.username}</td>
                    <td>{item.userId}</td>
                    <td>{item.acceleration}</td>
                    <td>￥<span>{item.totalAmount}</span></td>
                </tr>
            ))}
            </tbody>

        )
    }


    return (
        <div className='w-100%'>
            {/*<Compass></Compass>*/}
            <div className='w-100% flex'>
                {/*左边 侧边导航*/}
                {/*<div className="w-65.25 h-225 shrink-0 bg-[#FFF]">侧边导航</div>*/}
                {/*<LeftCompass />*/}

                {/*右边 加速计划*/}
                <div
                    className='w-97.5% mt-4 ml-4 pl-8 pt-8 w-286.75 h-203.5 shrink-0 border-rd-[0px_0px_10px_10px] bg-[#FFF]'>
                    <div className=' w-271.75 h-126.605 shrink-0 '>
                        <h3 className='text-[#323232] text-4 font-700 lh-6'>加速计划</h3>
                        {/*加速激励*/}
                        
                        <div className='pl-2 mt-6.0525'>
                            {/* <h4 className='w-17.66225 h-5.5 shrink-0 text-[rgba(0,0,0,0.85)] text-4 font-400 lh-6'>加速激励</h4> */}
                            {/*输出条*/}
                            {/* <div className='ml-11.25'> */}
                                {/* <Slider marks={marks} step={null} defaultValue={37} /> */}
                            {/* </div> */}
                            <Collapse items={item} defaultActiveKey={['1']} onChange={onChange} />
                            {/*激励榜单*/}
                            <div className='mt-8'>
                                <h3 className='w-17.75 h-5.5 shrink-0 text-[rgba(0,0,0,0.85)] text-4 font-400 lh-6'>激励榜单</h3>
                                <div className='flex'>
                                    <div className='flex mt-7.425 items-center'>
                                        <label
                                            className='ml-10.5575 text-[rgba(0,0,0,0.85)] text-3.5 font-400 lh-5.5'>用户ID: </label>
                                        <input
                                            onChange={(e)=>handleChange(e)}
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
                                    {/*表头*/}
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
                                    {/*表体*/}
                                    <ItemList/>
                                </table>


                            </div>

                            <div className="mt-4 flex flex-col justify-end items-center">
                                <MyPagination/>
                            </div>

                        </div>

                    </div>


                </div>
            </div>


        </div>
    )
}
export default Page