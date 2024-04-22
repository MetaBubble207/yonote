"use client"
import React, { useState } from 'react';
const Page=()=>{
    const [name, setName] = useState('');
    const [mode, setMode] = useState('');
    const [format, setFormat] = useState('');
    const [price, setPrice] = useState('');
    const [intro, setIntro] = useState('');
    const [description, setDescription] = useState('');
    return(
        <div>
            <div className={'w-1147px h-813px shrink-0 border-rd-[0px_0px_10px_10px] bg-[#FFF]'}>

                <div className={'w-629px h-482px mt-28px ml-10px'}>
                    <div className="text-[#323232]  text-4 font-700 lh-6  w-16 pl-100px">专栏设置</div>
                    <div>
                        <label className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>名称：</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={15} />

                    </div>
                    <div>
                        <label className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>消费模式：</label>
                        <input type="text" value={mode} onChange={(e) => setMode(e.target.value)} />
                    </div>
                    <div>
                        <label className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>内容形式：</label>
                        <input type="text" value={format} onChange={(e) => setFormat(e.target.value)} />
                    </div>
                    <div>
                        <label className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>价格：</label>
                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div>
                        <label className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>简介：</label>
                        <textarea value={intro} onChange={(e) => setIntro(e.target.value)} />
                    </div>
                    <div>
                        <label className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>专栏介绍：</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <button onClick={() => { setName(''); setMode(''); setFormat(''); setPrice(''); setIntro(''); setDescription(''); }}>清除</button>
                </div>

            </div>
        </div>
    )
}
export default Page;