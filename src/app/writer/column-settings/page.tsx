"use client"

import React, {Suspense, useEffect, useRef, useState} from 'react';
import {message, Switch} from 'antd';
import {api} from "@/trpc/react";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import OSS from "ali-oss";
import {W100H50Modal} from "@/app/_components/common/W100H50Modal";

let client = new OSS({
    region: 'oss-cn-shenzhen',
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
    accessKeySecret: process.env.NEXT_PUBLIC_ACCESS_KEY_SECRET,
    stsToken: process.env.NEXT_PUBLIC_STS_TOKEN,
    bucket: process.env.NEXT_PUBLIC_BUCKET
});

const Page = () => {
    const router = useRouter();
    const params = useSearchParams();
    const columnId = params.get("columnId");
    const columnData = api.column.getColumnDetail.useQuery({columnId: columnId}, {enabled: !!columnId}).data;
    const priceListData = api.priceList
        .getByColumnId.useQuery({columnId: columnId}, {enabled: !!columnId}).data
        ?.sort((item,pre)=> item.id - pre.id);
    const [name, setName] = useState(columnData?.name);
    const [priceList, setPriceList] = useState(priceListData);

    const [intro, setIntro] = useState(columnData?.introduce);
    const [cover, setCover] = useState(columnData?.logo);
    const [description, setDescription] = useState(columnData?.description);
    const [checkColor, setCheckColor] = useState("#1DB48D");
    const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const onChange = (checked) => {
        setCheckColor(checked ? "#1DB48D" : "#fff");
    };
    useEffect(()=>{
        setPriceList(priceListData);
    },[priceListData])
    useEffect(() => {
        setCover(columnData?.logo);
    }, [columnData]);
    const updateApi = api.column.update.useMutation({
        onSuccess: (data) => {

        }
    });
    const deleteApi = api.priceList.delById.useMutation({
        onSuccess: (data) => {

        }
    })
    const fileInputRef = useRef(null);
    const handleNameChange = (e) => setName(e.target.value);

    const updateCoverApi = api.column.updateCover.useMutation({
        onSuccess: (r) => {
            console.log(r);
        }
    });

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const result = await client.put(file.name, file);
                updateCoverApi.mutate({id: columnId, cover: result.url});
                setCover(result.url);
            } catch (err) {
                console.error('Upload error:', err);
            }
        }
    };

    const changeCover = () => {
        fileInputRef.current.click();
    };

    const submit = () => {
        console.log(priceList,priceListData);
            updateApi.mutate({
                id: columnId,
                name: name ?? columnData!.name ?? "",
                priceList: priceList,
                introduce: intro ?? columnData!.introduce ?? "",
                description: description ?? columnData!.description ?? ""
            });
        setIsEditing(false);
        setShowConfirmSubmitModal(false);
    };

    const handleClickSubmit = () => {
            submit();
    };

    const updatePriceList = (index, key, value) => {
        try{
            if(key === "price")
            value = parseFloat(value)
        }catch(e){
            messageApi.info("输入的价格不是合法的数字噢😯~");
            return false;
        }
        try{
            if(key === "timeLimit")
                value = parseFloat(value)
        }catch(e){
            messageApi.info("输入的天数不是纯数字噢😯~");
            return false;
        }
        const newList = [...priceList];
        newList[index][key] = value;
        setPriceList(newList);
    };

    const addNewStrategy = () => {
        if (priceList.length < 4) {
            // @ts-ignore
            setPriceList([...priceList, {price: 0, timeLimit: 0}]);
        }
    };
    const delStrategy = (index) => {
        const newList = priceList.filter((_, i) => i !== index);
        setPriceList(newList);
    };

    const ConfirmSubmitModal = () => (
        <W100H50Modal>
            <div className={"text-6"}>是否确认更改专栏简介</div>
            <div className={"space-x-10 mt-5"}>
                <button
                    className="w-22 h-8 shrink-0 bg-[#eea1a1ff] text-[#eb172fff] b-1 b-rd-1 ml-28 mt-1 text-3.5 font-400 lh-5.5 ml-4 mt-1"
                    onClick={() => setShowConfirmSubmitModal(false)}
                >
                    取消
                </button>
                <button
                    className="w-22 h-8 shrink-0 bg-#DAF9F1 b-1 b-rd-1 ml-28 mt-1 text-[#1DB48D] font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-4 mt-1"
                    onClick={submit}
                >
                    确认
                </button>
            </div>
        </W100H50Modal>
    );

    return (
        <Suspense>
            <div className={'w-full h-full mt-16px ml-18px'}>
                <div className={'w-97% flex items-center shrink-0 border-rd-10px bg-[#FFF] pb-35px'}>
                    <div className={'pt-7 ml-10'}>
                        <div className="text-[#323232] text-4 font-700 lh-6 w-16">专栏设置</div>
                        <table className={'ml-20.5'}>
                            <tbody>
                            {/*名称*/}
                            <tr>
                                <td style={{textAlign: 'right', paddingTop: '24px'}}>
                                    <span style={{color: 'red'}}>*</span>
                                    <label
                                        className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>名称：</label>
                                </td>
                                <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                    {isEditing ? (
                                        <input
                                            className="w-117 h-8 shrink-0 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] text-lg pl-3"
                                            placeholder="最多输入十五个字"
                                            style={{fontSize: '14px'}}
                                            type="text"
                                            value={name ?? columnData?.name ?? ""}
                                            onChange={handleNameChange}
                                            maxLength={15}
                                            required
                                        />
                                    ) : (
                                        <span
                                            className="text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">{name ?? columnData?.name ?? ""}</span>
                                    )}
                                </td>
                            </tr>
                            {/*消费模式*/}
                            <tr>
                                <td style={{textAlign: 'right', paddingTop: '24px'}}>
                                    <span style={{color: 'red'}}>*</span>
                                    <span
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
                                    <span style={{color: 'red'}}>*</span>
                                    <span
                                        className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>内容形式：</span>
                                </td>
                                <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                    <span
                                        className={'text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5'}>图文专栏</span>
                                </td>
                            </tr>
                            {/*价格*/}
                            {priceList?.map((strategy, index) => (
                                <tr key={index}>
                                    <td style={{paddingTop: '24px'}}>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    className={'w-40 h-8 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3'}
                                                    placeholder="大于99999天即为永久"
                                                    style={{fontSize: '14px'}}
                                                    type="text"
                                                    value={strategy.timeLimit}
                                                    onChange={(e) => {
                                                        const inputValue = e.target.value.replace(/\D/g, ''); // 只保留数字
                                                        updatePriceList(index, 'timeLimit', inputValue);
                                                    }}
                                                    maxLength={5}
                                                    required
                                                />
                                                天：
                                            </>
                                        ) : (
                                            <span
                                                className="text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">
                                                {strategy.timeLimit === 99999 ? '永久买断价格：' : `限时购买价格(${strategy.timeLimit}天)：`}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    className={'w-117 h-8 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3'}
                                                    placeholder="输入价格"
                                                    style={{fontSize: '14px'}}
                                                    type="text"
                                                    value={strategy.price}
                                                    onChange={(e) => {
                                                        const inputValue = e.target.value.replace(/[^\d.]/g, ''); // 只保留数字和小数点
                                                        updatePriceList(index, 'price', inputValue);
                                                    }}
                                                    maxLength={7}
                                                    required
                                                />
                                                <span onClick={() => delStrategy(index)}>删除</span>
                                            </>
                                        ) : (
                                            <span
                                                className="text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">{strategy.price}元</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {isEditing && priceList.length < 4 && (
                                <tr>
                                    <td colSpan={4} style={{textAlign: 'left', paddingTop: '24px'}}>
                                        <button
                                            className={'text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5 underline'}
                                            onClick={addNewStrategy}
                                        >
                                        + 添加新策略
                                        </button>
                                    </td>
                                </tr>
                            )}
                            {/*简介*/}
                            <tr>
                                <td style={{textAlign: 'right', paddingTop: '24px'}}>
                                    <span style={{color: 'red'}}>*</span>
                                    <span
                                        className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>简介：</span>
                                </td>
                                <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                    {isEditing ? (
                                        <textarea
                                            className={'w-117 h-30 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3'}
                                            placeholder="请输入专栏简介"
                                            style={{fontSize: '14px'}}
                                            value={intro ?? columnData?.introduce ?? ""}
                                            onChange={(e) => setIntro(e.target.value)}
                                            required
                                        />
                                    ) : (
                                        <span
                                            className="text-[rgba(0,0,0,0.85)] w-117 max-h-30  block overflow-ellipsis  overflow-hidden text-3.5 font-not-italic font-400 lh-5.5">{intro ?? columnData?.introduce ?? ""}</span>
                                    )}
                                </td>
                            </tr>
                            {/*详情*/}
                            <tr>
                                <td style={{textAlign: 'right', paddingTop: '24px'}}>
                                    <span style={{color: 'red'}}>*</span>
                                    <span
                                        className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>详情：</span>
                                </td>
                                <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                    {isEditing ? (
                                        <textarea
                                            className={'w-117 h-30 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3'}
                                            placeholder="请输入专栏详情"
                                            style={{fontSize: '14px'}}
                                            value={description ?? columnData?.description ?? ""}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    ) : (
                                        <span
                                            className="text-[rgba(0,0,0,0.85)] w-117 max-h-30  block overflow-ellipsis  overflow-hidden text-3.5 font-not-italic font-400 lh-5.5">{description ?? columnData?.description ?? ""}</span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingTop: '24px'}}>
                                        <span
                                            className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>禁止复制：</span>
                                </td>
                                <td style={{textAlign: 'left', paddingTop: '24px'}}>
                                        <span
                                            className={'text-[rgba(0,0,0,0.65)] text-3.5 font-not-italic font-400 lh-5.5'}>
                                            {/*<ConfigProvider*/}
                                            {/*    theme={{*/}
                                            {/*        components: {*/}
                                            {/*            Switch: {*/}
                                            {/*                // handleBg:"#000"*/}
                                            {/*            },*/}
                                            {/*        },*/}
                                            {/*    }}*/}
                                            {/*>*/}
                                            <Switch defaultChecked style={{background: checkColor}}
                                                    onChange={onChange}/>
                                            {/*</ConfigProvider>*/}
                                        </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className={'ml-20.5 mt-10'}>
                            {isEditing ? (
                                <>
                                    <button
                                        className={'w-22 h-8 shrink-0 bg-[#DAF9F1] b-1 b-rd-1 ml-28 mt-1 text-[#1DB48D] font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-4 mt-1'}
                                        onClick={handleClickSubmit}
                                    >
                                        提交
                                    </button>
                                    <button
                                        className={'w-22 h-8 shrink-0 bg-[#eea1a1ff] text-[#eb172fff] b-1 b-rd-1 ml-28 mt-1 text-3.5 font-400 lh-5.5 ml-4 mt-1'}
                                        onClick={() => setIsEditing(false)}
                                    >
                                        取消
                                    </button>
                                </>
                            ) : (
                                <button
                                    className={'w-22 h-8 shrink-0 bg-[#DAF9F1] b-1 b-rd-1 ml-28 mt-1 text-[#1DB48D] font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-4 mt-1'}
                                    onClick={() => setIsEditing(true)}
                                >
                                    编辑
                                </button>
                            )}
                        </div>
                    </div>
                    {/*封面*/}
                    <div className={"flex items-center ml-10"}>
                        <div>
                            <span
                                className={'text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5'}>封面：</span>
                        </div>
                        <div>
                            <div>
                                <Image src={cover ?? "/images/user/Loading.svg"} alt={"cover"} width={116}
                                       height={150}/>
                                <div
                                    className={"flex items-center w-19.5 h-6 shrink-0 border-rd-4 bg-[#45E1B8] mx-auto pl-2.5  mt-5"}>
                                    <Image className={"w-3.477 h-3.477 "} src={"/images/user/Edit.svg"}
                                           alt={"头像"}
                                           width={"10"}
                                           height={"10"}/>
                                    <button className="w-10 ml-1.25 text-[#252525] text-2.5 font-500 lh-6"
                                            onClick={changeCover}>
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
                </div>
            </div>
            {showConfirmSubmitModal && <ConfirmSubmitModal/>}
        </Suspense>
    );
}

export default Page;
