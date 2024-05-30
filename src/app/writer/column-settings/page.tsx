"use client"

import React, {useRef, useState} from 'react';
import { Switch } from 'antd';
import {api} from "@/trpc/react";
import useLocalStorage from '@/tools/useStore';
import Image from "next/image";
import {useSearchParams} from "next/navigation";
import OSS from "ali-oss";

let client = new OSS({
    region: 'oss-cn-shenzhen',
    //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
    accessKeySecret: process.env.NEXT_PUBLIC_ACCESS_KEY_SECRET,
    stsToken: process.env.NEXT_PUBLIC_STS_TOKEN,
    bucket: process.env.NEXT_PUBLIC_BUCKET
});
const Page=()=>{
    let data;
    const [token] = useLocalStorage("token", null);
    const params = useSearchParams();
    const columnId = params.get("columnId");
    if(columnId){
        data = api.column.getColumnDetail.useQuery({columnId:columnId}).data
    }
    const [name, setName] = useState(data?.name);
    const [mode, setMode] = useState('');
    const [format, setFormat] = useState('');
    const [price, setPrice] = useState(data?.price);
    const [intro, setIntro] = useState(data?.introduce);
    const [cover, setCover] = useState(data?.logo);
    const [description, setDescription] = useState(data?.description);
    const [checkColor,setCheckColor] = useState("#1DB48D")
    const onChange = (checked: boolean) => {
        if(checked){
            setCheckColor("#1DB48D")
        }else{
            setCheckColor("#fff")
        }
    };

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setName(inputValue);
    };

    const remainingCharacters =  name?.length;
    const updateApi = api.column.update.useMutation({
        onSuccess: (data) => {
            console.log(data)
        }
    })
    const fileInputRef = useRef(null);
    const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setName( e.target.value)
    }
    const updateCoverApi = api.column.updateCover.useMutation({
        onSuccess:(r)=>{
            console.log(r)
        }
    })
    // 处理文件选择
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const result = await client.put(file.name, file);
                updateCoverApi.mutate({id: columnId, cover: result.url})
                setCover(result.url)
            } catch (err) {
                console.error('Upload error:', err);
            }
        }
    };
    // 触发文件输入框
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return(
        <div className={'w-full h-full mt-16px ml-18px'}>
            <div className={'w-97% flex items-center shrink-0 border-rd-[0px_0px_10px_10px] bg-[#FFF] pb-35px'}>

                <div className={' pt-7 ml-10'}>
                    <div className="text-[#323232]  text-4 font-700 lh-6  w-16 ">专栏设置</div>
                    <table className={'ml-20.5'}>
                        <tbody>
                        {/*名称*/}
                        <tr>
                            <td style={{textAlign: 'right', paddingTop: '24px'}}>
                                <span style={{color: 'red'}}>*</span><label
                                className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>名称：</label>
                            </td>
                            <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                <div>
                                    <input
                                        className="w-117 h-8 shrink-0 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] text-lg pl-3"
                                        placeholder="最多输入十五个字"
                                        style={{fontSize: '14px'}}
                                        type="text"
                                        value={name ?? data?.name ?? ""}
                                        onChange={(e) => handleNameChange(e)}
                                        maxLength={15}
                                        required
                                    />
                                    <span className="text-#999 font-14px ml--46px">{remainingCharacters}/15</span>
                                </div>
                            </td>
                        </tr>
                        {/*消费模式*/}
                        <tr>
                            <td style={{textAlign: 'right', paddingTop: '24px'}}>
                                <span style={{color: 'red'}}>*</span><span
                                className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>消费模式：</span>
                            </td>
                            <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                <span
                                    className={'text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5'}>一口价</span>
                            </td>
                        </tr>
                        {/*内容形式*/}
                        <tr>
                            <td style={{textAlign: 'right', paddingTop: '24px'}}>
                                <span style={{color: 'red'}}>*</span><span
                                className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>内容形式：</span>
                            </td>
                            <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                <span
                                    className={'text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5'}>图文专栏</span>
                            </td>
                        </tr>
                        {/*价格*/}
                        <tr>
                            <td style={{textAlign: 'right', paddingTop: '24px'}}>
                                <label className={' text-3.5 font-not-italic font-400 lh-5.5'}>价格：</label>
                            </td>
                            <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                <input
                                    className={'w-22 h-8 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3'}
                                    placeholder="请输入"
                                    style={{fontSize: '14px'}}
                                    type="text"
                                    value={price ?? data?.price ?? 0}
                                    onChange={(e) => {
                                        const inputValue = e.target.value.replace(/\D/g, ''); // 只保留数字
                                        // setPrice(inputValue);
                                        setPrice(parseFloat(inputValue));
                                    }}
                                    maxLength={15}
                                    pattern="[0-9]*" // 只允许输入数字
                                    required
                                />
                                <span className={' text-3.5 font-not-italic font-400 lh-5.5 ml-2'}>元</span>
                            </td>
                        </tr>

                        {/*简介*/}
                        <tr>
                            <td style={{textAlign: 'right', verticalAlign: 'top', paddingTop: '24px'}}>
                                <label
                                    className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>简介：</label>
                            </td>
                            <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                <textarea
                                    className={'w-117 h-22 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] p1'}
                                    placeholder="请输入简介"
                                    style={{resize: 'none', fontSize: '14px'}}
                                    value={intro ?? data?.introduce ?? ""} onChange={(e) => setIntro(e.target.value)}/>
                            </td>
                        </tr>
                        {/*专栏介绍*/}
                        <tr>
                            <td className={"pt-24px"} style={{verticalAlign: 'top'}}>
                                <span style={{color: 'red'}}>*</span><label
                                className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>专栏介绍：</label>
                            </td>
                            <td className={"flex items-center justify-between pt-24px"}>
                                <textarea
                                    className={'w-117 h-22 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] p1'}
                                    placeholder="编辑专栏介绍"
                                    style={{resize: 'none', fontSize: '14px'}}
                                    value={description ?? data?.description ?? ""}
                                    onChange={(e) => setDescription(e.target.value)}/>
                            </td>
                        </tr>
                        {/*禁止复制*/}
                        <tr>
                            <td style={{textAlign: 'right', paddingTop: '24px'}}>
                                <span
                                    className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>禁止复制：</span>
                            </td>
                            <td style={{textAlign: 'left', paddingTop: '24px'}}>
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
                                    <Switch defaultChecked style={{background: checkColor}} onChange={onChange}/>
                                    {/*</ConfigProvider>*/}
                                </span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button className={"ml-20 mt-5 w-65px h-32px bg-#DAF9F1 text-#1DB48D"} onClick={() => {
                        // updateApi.mutate({
                        //     id: data!.id!,
                        //     name:data!.name ?? "",
                        //     price:data!.price ?? 0,
                        //     introduce:data!.introduce ?? "",
                        // })
                        updateApi.mutate({
                            id: data!.id!,
                            name: name ?? data!.name ?? "",
                            price: price ?? data!.price ?? 0,
                            introduce: intro ?? data!.introduce ?? "",
                        })
                    }}>提交
                    </button>
                    <button className={' ml-5 mt-5 w-65px h-32px bg-[#eaececff] text-[#7d7f7dff]'}
                            onClick={() => {
                                setName('');
                                setMode('');
                                setFormat('');
                                setPrice(0);
                                setIntro('');
                                setDescription('');
                            }}>
                        清除
                    </button>
                </div>
                <div className={"ml-10"}>
                    <Image src={cover ?? "/images/user/Loading.svg"} alt={"cover"} width={116} height={150}/>
                    <div
                        className={"flex items-center w-19.5 h-6 shrink-0 border-rd-4 bg-[#45E1B8] mx-auto pl-2.5  mt-5"}>
                        <Image className={"w-3.477 h-3.477 "} src={"/images/user/Edit.svg"} alt={"头像"} width={"10"}
                               height={"10"}/>
                        <button className="w-10 ml-1.25 text-[#252525] text-2.5 font-500 lh-6"
                                onClick={handleButtonClick}>
                        修改封面
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{display: 'none'}}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Page;
