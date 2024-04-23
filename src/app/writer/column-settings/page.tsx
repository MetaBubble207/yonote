"use client"
import React, { useState } from 'react';
import { Switch,ConfigProvider } from 'antd';

const Page=()=>{
    const [name, setName] = useState('');
    const [mode, setMode] = useState('');
    const [format, setFormat] = useState('');
    const [price, setPrice] = useState('');
    const [intro, setIntro] = useState('');
    const [description, setDescription] = useState('');
    const [checkColor,setCheckColor] = useState("#1DB48D")
    const onChange = (checked: boolean) => {
        if(checked){
            setCheckColor("#1DB48D")
        }else{
            setCheckColor("#fff")
        }
    };
    return(
        <div className={'w-full h-full mt-16px ml-18px'}>
            <div className={'w-97% h-90% shrink-0 border-rd-[0px_0px_10px_10px] bg-[#FFF]'}>

                <div className={'w-100% h-100% pt-7 ml-10'}>
                    <div className="text-[#323232]  text-4 font-700 lh-6  w-16 ">专栏设置</div>
                    <table className={'ml-20.5'}>
                        <tbody>
                        {/*名称*/}
                        <tr>
                            <td style={{ textAlign: 'right', paddingTop: '24px'}}>
                                <span style={{ color: 'red' }}>*</span><label className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>名称：</label>
                            </td>
                            <td style={{ textAlign: 'left' ,paddingTop: '24px'}}>
                                <input className={'w-117 h-8 shrink-0 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] text-lg pl-3'}
                                       placeholder="最多输入十五个字"
                                       style={{ color: '#999',fontSize:'14px'}}
                                       type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={15} required/>
                                <span className={'text-#999 font-14px ml--46px'}>0/15</span>
                            </td>
                        </tr>
                        {/*消费模式*/}
                        <tr>
                            <td style={{ textAlign: 'right', paddingTop: '24px'}}>
                                <span style={{ color: 'red' }}>*</span><span className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>消费模式：</span>
                            </td>
                            <td style={{ textAlign: 'left' ,paddingTop: '24px'}}>
                                <span className={'text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5'}>一口价</span>
                            </td>
                        </tr>
                        {/*内容形式*/}
                        <tr>
                            <td style={{ textAlign: 'right', paddingTop: '24px'}}>
                                <span style={{ color: 'red' }}>*</span><span className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>内容形式：</span>
                            </td>
                            <td style={{ textAlign: 'left',paddingTop: '24px' }}>
                                <span className={'text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5'}>图文专栏</span>
                            </td>
                        </tr>
                        {/*价格*/}
                        <tr>
                            <td style={{ textAlign: 'right', paddingTop: '24px'}}>
                                <label className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>价格：</label>
                            </td>
                            <td style={{ textAlign: 'left',paddingTop: '24px' }}>
                                <input className={'w-22 h-8 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3'}
                                       placeholder="请输入"
                                       style={{ color: '#999',fontSize:'14px'}}
                                    type="text" value={price} onChange={(e) => setPrice(e.target.value)} maxLength={15} required/>
                                <span className={'text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5 ml-2'}>元</span>
                            </td>
                        </tr>
                        {/*简介*/}
                        <tr>
                            <td style={{ textAlign: 'right', verticalAlign: 'top',paddingTop: '24px'}}>
                                <label className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>简介：</label>
                            </td>
                            <td style={{ textAlign: 'left' ,paddingTop: '24px'}}>
                                <textarea className={'w-117 h-22 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3'}
                                          placeholder="请输入简介"
                                          style={{ resize: 'none',color: '#999',fontSize:'14px'}}
                                    value={intro} onChange={(e) => setIntro(e.target.value)} />
                            </td>
                        </tr>
                        {/*专栏介绍*/}
                        <tr>
                            <td style={{ textAlign: 'right',paddingTop: '24px' }}>
                                <span style={{ color: 'red' }}>*</span><label className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>专栏介绍：</label>
                            </td>
                            <td style={{display:'flex',justifyContent: 'space-between' ,textAlign: 'left' ,paddingTop: '24px'}}>
                                <span className={'text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5'} style={{ textAlign: 'left' }}>编辑专栏介绍</span>
                                <span className={'text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5'} style={{ textAlign: 'right' }}
                                      onClick={() => { setName(''); setMode(''); setFormat(''); setPrice(''); setIntro(''); setDescription(''); }}>清除</span>
                            </td>
                        </tr>
                        {/*禁止复制*/}
                        <tr>
                            <td style={{ textAlign: 'right', paddingTop: '24px'}}>
                                <span className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>禁止复制：</span>
                            </td>
                            <td style={{ textAlign: 'left',paddingTop: '24px' }}>
                                <span className={'text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5'}>
                                    {/*<ConfigProvider*/}
                                    {/*    theme={{*/}
                                    {/*        components: {*/}
                                    {/*            Switch: {*/}
                                    {/*                // handleBg:"#000"*/}
                                    {/*            },*/}
                                    {/*        },*/}
                                    {/*    }}*/}
                                    {/*>*/}
                                    <Switch defaultChecked style={{background:checkColor}}  onChange={onChange} />
                                    {/*</ConfigProvider>*/}
                                </span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}
export default Page;