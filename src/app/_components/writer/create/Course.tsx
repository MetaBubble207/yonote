"use client";
import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Course = () => {
  //付费模式的button切换
  const [selectedButton, setSelectButton] = useState(1);
  const handleClick = () => {
    setSelectButton(selectedButton == 1 ? 2 : 1);
  };

  // 点击限时订阅跳转页面
  const handleButtonClick = () => {
    handleClick();
    router.push("/writer/create-course/payment");
  };

  // 限制输入框 “专栏ID” 输入为英文或数字
  const [columnID, setColumnID] = useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (/^[A-Za-z0-9]+$/.test(value) || value === "") {
      setColumnID(value);
    }
  };

  // 限制“价格”输入值最小为50
  const [price, setPrice] = useState("");
  const handleChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  // 提交表单时检查价格输入值
  const handleSubmit = () => {
    if (parseInt(price) < 50) {
      // 如果输入值小于50，则清除输入值
      setPrice("");
    }
    // 在这里可以添加其他提交逻辑
  };

  // 路由到payment页面
  const router = useRouter();

  return (
    <div className="w-286.75 h-195 border-rd-[0px_0px_10px_10px] ml-16px mt-18px pt-25.75 relative bg-[#FFF]">
      {/* <button onClick={() => router.push('/writer/create-course/payment')}>路由</button> */}
      <div className="text-4 font-700 lh-6 ml-53.75 w-16 text-[#323232]">
        小课创建
      </div>

      <div className="mt-6 flex h-8 w-full items-center">
        <div className="text-3.5 font-400 lh-5.5 w-10.5 ml-81.25 text-[rgba(0,0,0,0.85)]">
          名称：
        </div>
        <div className="items-ceter w-117 border-rd-1 mt-78 mb-78 inline h-8 border-2 border-solid">
          <input
            type=""
            name=""
            id=""
            placeholder="起个名字"
            className="text-3.5 font-400 lh-5.5 w-110 ml-3 text-[rgba(0,0,0,0.25)] outline-none"
          ></input>
        </div>
      </div>

      <div className="mt-6 flex h-8 w-full items-center">
        <div className="text-3.5 font-400 lh-5.5 ml-53 text-right text-[rgba(0,0,0,0.85)]">
          专栏ID
        </div>
        <div className="text-3.5 font-400 lh-5.5 text-right text-[rgba(0,0,0,0.25)]">
          （英文或数字）
        </div>
        <div className="text-3.5 font-400 lh-5.5 text-right text-[rgba(0,0,0,0.85)]">
          ：
        </div>
        <div className="items-ceter w-117 border-rd-1 mt-78 mb-78 flex h-8 border-2 border-solid">
          <input
            type="text"
            name="columnID"
            id="columnID"
            placeholder="请输入你的专属ID"
            className="text-3.5 font-400 lh-5.5 w-110 ml-3 justify-center text-[rgba(0,0,0,0.25)] outline-none"
            value={columnID}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex">
        <div className="text-3 font-400 lh-5.5 ml-91.5 h-5.5 mt-4 text-[red]">
          *
        </div>
        <div className="text-3 font-400 lh-5.5 w-22.5 h-5.5 mt-4 text-[rgba(51,51,51,0.60)]">
          提交后不可修改
        </div>
      </div>

      <div className="h-5.5 mt-8 flex w-full items-center">
        <div className="text-3.5 font-400 lh-5.5 w-17.5 h-5.5 ml-74.25 text-right text-[rgba(0,0,0,0.85)]">
          内容形式：
        </div>
        <Image
          src={"/images/writer/co-author/check.svg"}
          alt="check"
          width={20}
          height={20}
          className="h-4 w-4"
        />
        <div className="text-[rgba(0,0,0,0.65) text-3.5 font-400 lh-5.5 ml-2">
          小课
        </div>
      </div>

      <div className="h-5.5 mt-8 flex w-full items-center">
        <div className="text-3.5 font-400 lh-5.5 ml-74.25 text-right text-[rgba(0,0,0,0.85)]">
          付费模式：
        </div>
        <button className="h-5.5 flex w-20 items-center" onClick={handleClick}>
          {selectedButton === 1 ? (
            <Image
              src={"/images/writer/co-author/check.svg"}
              alt="check"
              width={20}
              height={20}
              className="h-4 w-4"
            />
          ) : (
            <Image
              src={"/images/writer/co-author/uncheck.svg"}
              alt="uncheck"
              width={20}
              height={20}
              className="h-4 w-4"
            />
          )}
          <div className="text-3.5 font-400 lh-5.5 ml-2 text-[rgba(0,0,0,0.65)]">
            永久买断
          </div>
        </button>
        <button
          className="h-5.5 ml-8 flex w-20 items-center"
          onClick={handleButtonClick}
        >
          {selectedButton === 2 ? (
            <Image
              src={"/images/writer/co-author/check.svg"}
              alt="check"
              width={20}
              height={20}
              className="h-4 w-4"
            />
          ) : (
            <Image
              src={"/images/writer/co-author/uncheck.svg"}
              alt="uncheck"
              width={20}
              height={20}
              className="h-4 w-4"
            />
          )}
          <div className="text-3.5 font-400 lh-5.5 ml-2 text-[rgba(0,0,0,0.65)]">
            限时订阅
          </div>
        </button>

        <div className="text-3 font-400 lh-5.5 h-5.5 ml-12 text-[red]">*</div>
        <div className="text-3 font-400 lh-5.5 h-5.5 text-right text-[rgba(51,51,51,0.60)]">
          提交后不可修改
        </div>
      </div>

      <div className="mt-4 flex h-8 w-full items-center">
        <div className="text-3.5 font-400 lh-5.5 w-32.5 ml-42 text-right text-[rgba(0,0,0,0.85)]">
          价格
        </div>
        <div className="text-3.5 font-400 lh-5.5 text-right text-[rgba(0,0,0,0.25)]">
          （最低50元）
        </div>
        <div className="text-3.5 font-400 lh-5.5 text-right text-[rgba(0,0,0,0.85)]">
          ：
        </div>
        <div className="w-22 fill-#FFF border-rd-1 inline h-8 border-2 border-solid">
          <input
            type="number"
            name="price"
            id="price"
            onChange={handleChangePrice}
            value={price}
            placeholder="请输入"
            className="text-3.5 font-400 lh-5.5 w-15 ml-3 mt-1 text-[rgba(0,0,0,0.25)] outline-none"
          ></input>
        </div>
        <div className="text-3.5 font-400 lh-5.5 ml-2 text-right text-[rgba(0,0,0,0.65)]">
          元
        </div>
      </div>

      <button className="w-16.25 ml-65.75 mt-20 h-8" onClick={handleSubmit}>
        <Image
          src={"/images/writer/co-author/submit.svg"}
          alt="submit"
          width={20}
          height={20}
          className="w-16.25 h-8"
        />
      </button>
    </div>
  );
};

export default Course;
