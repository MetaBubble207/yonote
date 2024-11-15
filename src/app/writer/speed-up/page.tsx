'use client'
import Image from "next/image";
import React, {useState} from "react";
import Date from '@/app/_components/writer/datarange/Date'
import {Collapse, type CollapseProps, message, Slider, type SliderSingleProps} from 'antd';
import {throttle} from "lodash";

const distributionConfig: SliderSingleProps['marks'] = {
    0: '0%',
    10: '10%',
    20: '20%',
    30: '30%',
    40: '40%',
    50: '50%',
    60: '60%',
    70: '70%',
};
const extendConfig: SliderSingleProps['marks'] = {
    0: '0%',
    10: '10%',
    20: '20%',
    30: '30%',
    40: '40%',
    50: '50%',
    60: '60%',
    70: '70%',
}
const Page = () => {
    const [distributionValue, setDistributionValue] = useState<number>(50);
    const [extendValue, setExtendValue] = useState<number>(20);
    const [messageApi, contextHolder] = message.useMessage();
    const throttledWarning = throttle(() => {
        messageApi.warning("分销激励和推广激励之和不能超过70%");
    }, 2000);
    const handleDistributionChange = (value: number) => {
        if (value + extendValue <= 70) {
            setDistributionValue(value);
        } else {
            throttledWarning();
        }
    };

    const handleExtendChange = (value: number) => {
        if (distributionValue + value <= 70) {
            setExtendValue(value);
        } else {
            throttledWarning();
        }
    };

    const item: CollapseProps['items'] = [
        {
            key: '1',
            label: '分销激励',
            children: (
                <Slider
                    marks={distributionConfig}
                    step={1}
                    value={distributionValue}
                    max={70}
                    onChange={handleDistributionChange}
                />
            ),
        },
        {
            key: '2',
            label: '推广激励',
            children: (
                <Slider
                    marks={extendConfig}
                    step={1}
                    value={extendValue}
                    max={70}
                    onChange={handleExtendChange}
                />
            ),
        },
    ];
    const [userId, setUserId] = useState<string>('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(`查询: ${e.target.value}`)
        setUserId(e.target.value)
    }
    const ItemList: React.FC = () => {
        return (
            <tbody className='text-center'>
            {/*{items.map((item, index) => (*/}
            {/*    <tr key={index} className='border-t solid'>*/}
            {/*        <td>{item.ranking}</td>*/}
            {/*        <td className='relative'>*/}
            {/*            <div*/}
            {/*                className={"absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shrink-0 border-rd-8"}>*/}
            {/*                <div className="relative w-8 h-8">*/}
            {/*                    <Image*/}
            {/*                        placeholder="blur"*/}
            {/*                        blurDataURL={DefaultLoadingPicture()}*/}
            {/*                        src={item.avatar ?? DefaultLoadingPicture()}*/}
            {/*                        alt='cover'*/}
            {/*                        quality={100}*/}
            {/*                        fill*/}
            {/*                        loading='lazy'*/}
            {/*                        className='rounded object-cover '*/}
            {/*                    />*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </td>*/}
            {/*        <td>{item.username}</td>*/}
            {/*        <td>{item.userId}</td>*/}
            {/*        <td>{item.extendConfig}</td>*/}
            {/*        <td>￥<span>{item.totalAmount}</span></td>*/}
            {/*    </tr>*/}
            {/*))}*/}
            </tbody>
        )
    }

    return (
        <div className='w-full h-full pl-8 pt-8 rounded-2.5 bg-[#FFF]'>
            {contextHolder}
            <div className=' w-271.75 h-126.605 shrink-0 '>
                <h3 className='text-[#323232] text-4 font-700 lh-6'>加速计划</h3>
                {/*加速激励*/}
                <div className='pl-2 mt-6.0525'>
                    <Collapse items={item}/>
                    {/*激励榜单*/}
                    <div className='mt-8'>
                        <h3 className='w-17.75 h-5.5 shrink-0 text-[rgba(0,0,0,0.85)] text-4 font-400 lh-6'>激励榜单</h3>
                        <div className='flex'>
                            <div className='flex mt-7.425 items-center'>
                                <label
                                    className='ml-10.5575 text-[rgba(0,0,0,0.85)] text-3.5 font-400 lh-5.5'>用户ID: </label>
                                <input
                                    onChange={(e) => handleChange(e)}
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
                        {/*<MyPagination />*/}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Page
