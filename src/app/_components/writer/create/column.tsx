"use client"
import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import {api} from "@/trpc/react";

const Column = () => {
    // 限制输入框 “专栏ID” 输入为英文或数字
    const [name,setName] = useState('');
    const [columnID, setColumnID] = useState('');
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (/^[A-Za-z0-9]+$/.test(value) || value === '') {
            setColumnID(value);
        }
    };

    // 限制“价格”输入值最小为50
    const [price, setPrice] = useState('');
    const handleChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value);
    };

    // 提交表单时检查价格输入值
    const createApi = api.column.create.useMutation({
        onSuccess: (data) => {
            console.log(data)
        }
    })
    const token = localStorage.getItem('token');
    // 提交表单时检查价格输入值
    const handleSubmit = () => {
        if (parseInt(price) < 50 || token === null) {
            // 如果输入值小于50，则清除输入值
            setPrice('');
            return false;
        }
        // 在这里可以添加其他提交逻辑
        // console.log(name, columnID, price);
        createApi.mutate({
            id:columnID,
            name:name,
            price:parseInt(price),
            userId: token
        })
    };


    return(
        <div className="relative w-286.75 h-195 border-rd-[0px_0px_10px_10px] bg-[#FFF] mt-16px ml-18px pt-25.75" >
            <div className="text-[#323232] text-4 font-700 lh-6 mt-4 ml-53.75 w-16 ">专栏创建</div>

            <div className="flex items-center w-full h-8 mt-6 ">
                <div className="text-[rgba(0,0,0,0.85)] text-3.5 font-400 lh-5.5 w-10.5  ml-81.25 ">名称：</div>
                <div className="inline items-ceter w-117 h-8 border-rd-1 border-2 border-solid mt-78 mb-78">
                    <input type="" name="" id="" value={name} onChange={(e)=>setName(e.target.value)} placeholder="起个名字" className=" outline-none  text-3.5 font-400 lh-5.5 w-110 ml-3" ></input>
                </div>
            </div>

            <div className="flex items-center w-full h-8 mt-6">
                <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 ml-53">专栏ID</div>
                <div className="text-[rgba(0,0,0,0.25)] text-right text-3.5 font-400 lh-5.5 ">（英文或数字）</div>
                <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 ">：</div>
                <div className="flex items-ceter w-117 h-8 border-rd-1 border-2 border-solid mt-78 mb-78">
                    <input
                        type="text"
                        name="columnID"
                        id="columnID"
                        placeholder="请输入你的专属ID"
                        className="justify-center outline-none  text-3.5 font-400 lh-5.5 w-110 ml-3"
                        value={columnID}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="flex">
                <div className="text-[red] text-3 font-400 lh-5.5 ml-91.5 mt-4 h-5.5">*</div>
                <div className="text-[rgba(51,51,51,0.60)] text-3 font-400 lh-5.5 mt-4 w-22.5 h-5.5">提交后不可修改</div>
            </div>

            <div className="flex items-center w-full h-5.5 mt-8">
                <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 w-17.5 h-5.5 ml-74.25">内容形式：</div>
                <Image src={"/images/writer/co-author/check.svg"} alt="check" width={20} height={20} className="w-4 h-4 "/>
                <div className="text-[rgba(0,0,0,0.65) text-3.5 font-400 lh-5.5 ml-2">专栏</div>
            </div>

            <div className="flex items-center w-full h-5.5 mt-8">
                <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 ml-74.25">付费模式：</div>
                <button className="flex items-center w-20 h-5.5">
                    <Image src={"/images/writer/co-author/check.svg"} alt="check" width={20} height={20} className="w-4 h-4 "/>
                    <div className="text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5 ml-2">永久买断</div>
                </button>

                <div className="text-[red] text-3 font-400 lh-5.5 ml-12 h-5.5">*</div>
                <div className="text-[rgba(51,51,51,0.60)] text-right text-3 font-400 lh-5.5  h-5.5">提交后不可修改</div>
            </div>

            <div className="flex items-center w-full h-8 mt-4">
                <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 w-32.5 ml-42">价格</div>
                <div className="text-[rgba(0,0,0,0.25)] text-right text-3.5 font-400 lh-5.5 ">（最低50元）</div>
                <div className="text-[rgba(0,0,0,0.85)] text-right text-3.5 font-400 lh-5.5 ">：</div>
                <div className="inline w-22 h-8 fill-#FFF border-rd-1 border-2 border-solid  ">
                    <input
                        type="number"
                        name="price"
                        id="price"
                        onChange={handleChangePrice}
                        value={price}
                        placeholder="请输入"
                        className="outline-none  text-3.5 font-400 lh-5.5 w-15 ml-3 mt-1" >
                    </input>
                </div>
                <div className="text-[rgba(0,0,0,0.65)] text-right text-3.5 font-400 lh-5.5 ml-2">元</div>
            </div>

            <button className="w-16.25 h-8 ml-65.75 mt-20" onClick={handleSubmit}>
                <Image src={"/images/writer/co-author/submit.svg"} alt="submit" width={20} height={20} className="w-16.25 h-8"/>
            </button>
        </div>
    );
};
export default Column;
