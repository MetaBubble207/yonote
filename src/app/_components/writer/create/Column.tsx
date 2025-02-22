"use client";
import React, { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { api } from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import { useRouter, useSearchParams } from "next/navigation";
import { message } from "antd";

const Column = () => {
  const params = useSearchParams();
  const [columnId, setColumnId] = useState(params.get("id"));

  const priceListData = api.priceList.getByColumnId
    .useQuery({ columnId: columnId }, { enabled: !!columnId })
    .data?.sort((a, b) => a.id - b.id);

  const [priceList, setPriceList] = useState(priceListData ?? []);
  const [isEditing, setIsEditing] = useState(false);

  // 限制输入框 “专栏ID” 输入为英文或数字
  const [name, setName] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const info = () => {
    messageApi.info("该邀请码不存在或者已经被使用了噢😯~");
  };

  const router = useRouter();
  // 提交表单时检查价格输入值
  const createApi = api.invitationCode.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
      if (data === false) {
        info();
        return;
      }
      router.push(`/writer/homepage?columnId=${columnId}`);
    },
    onError: (data) => {
      info();
      console.log(data);
    },
  });
  const [token] = useLocalStorage("token", null);
  // 提交表单时检查价格输入值
  const handleSubmit = () => {
    createApi.mutate({
      id: columnId,
      name: name,
      // priceList: priceList,
      userId: token,
    });
  };

  const updatePriceList = (index, key, value) => {
    try {
      if (key === "price") value = parseFloat(value);
    } catch (e) {
      messageApi.info("输入的价格不是合法的数字噢😯~");
      return false;
    }
    try {
      if (key === "timeLimit") value = parseFloat(value);
    } catch (e) {
      messageApi.info("输入的天数不是纯数字噢😯~");
      return false;
    }
    const newList = [...priceList];
    newList[index][key] = value;
    setPriceList(newList);
  };

  const addNewStrategy = () => {
    if (!priceList || priceList.length < 4) {
      // @ts-ignore
      setPriceList([...priceList, { price: 0, timeLimit: 0 }]);
    }
  };

  const delStrategy = (index) => {
    const newList = priceList.filter((_, i) => i !== index);
    setPriceList(newList);
  };
  return (
    <div className="w-286.75 h-195 border-rd-[0px_0px_10px_10px] mt-16px ml-18px pt-25.75 relative bg-[#FFF]">
      {contextHolder}
      <div className="text-4 font-700 lh-6 ml-53.75 mt-4 w-16 text-[#323232]">
        专栏创建
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
            maxLength={15}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="起个名字"
            className="text-3.5 font-400 lh-5.5 w-110 ml-3 outline-none"
          ></input>
        </div>
      </div>

      <div className="mt-6 flex h-8 w-full items-center">
        <div className="text-3.5 font-400 lh-5.5 ml-78 text-right text-[rgba(0,0,0,0.85)]">
          专栏ID：{columnId}
        </div>
      </div>

      <div className="h-5.5 mt-8 flex w-full items-center">
        <div className="text-3.5 font-400 lh-5.5 w-17.5 h-5.5 ml-75 text-right text-[rgba(0,0,0,0.85)]">
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
          专栏
        </div>
      </div>

      <div className="h-5.5 mt-8 flex w-full items-center">
        <div className="text-3.5 font-400 lh-5.5 ml-75 text-right text-[rgba(0,0,0,0.85)]">
          付费模式：
        </div>
        <button className="h-5.5 flex w-20 items-center">
          <Image
            src={"/images/writer/co-author/check.svg"}
            alt="check"
            width={20}
            height={20}
            className="h-4 w-4"
          />
          <div className="text-3.5 font-400 lh-5.5 ml-2 text-[rgba(0,0,0,0.65)]">
            永久买断
          </div>
        </button>

        <div className="text-3 font-400 lh-5.5 h-5.5 ml-12 text-[red]">*</div>
        <div className="text-3 font-400 lh-5.5 h-5.5 text-right text-[rgba(51,51,51,0.60)]">
          提交后不可修改
        </div>
      </div>

      {/*价格*/}
      {/*{priceList?.map((strategy, index) => (*/}
      {/*    <tr key={index}>*/}
      {/*        <td style={{paddingTop: '24px'}}>*/}
      {/*            {isEditing ? (*/}
      {/*                <>*/}
      {/*                    <input*/}
      {/*                        className={'w-40 h-8 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3'}*/}
      {/*                        placeholder="大于99998天即为永久"*/}
      {/*                        style={{fontSize: '14px'}}*/}
      {/*                        type="text"*/}
      {/*                        value={strategy.timeLimit}*/}
      {/*                        onChange={(e) => {*/}
      {/*                            const inputValue = e.target.value.replace(/\D/g, ''); // 只保留数字*/}
      {/*                            updatePriceList(index, 'timeLimit', inputValue);*/}
      {/*                        }}*/}
      {/*                        maxLength={7}*/}
      {/*                        required*/}
      {/*                    />*/}
      {/*                    天：*/}
      {/*                </>*/}
      {/*            ) : (*/}
      {/*                <span*/}
      {/*                    className="text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">*/}
      {/*                                    {strategy.timeLimit >= 99999 ? '永久买断价格：' : `限时购买价格(${strategy.timeLimit}天)：`}*/}
      {/*                                </span>*/}
      {/*            )}*/}
      {/*        </td>*/}
      {/*        <td style={{textAlign: 'left', paddingTop: '24px'}}>*/}
      {/*            {isEditing ? (*/}
      {/*                <>*/}
      {/*                    <input*/}
      {/*                        className={'w-117 h-8 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3'}*/}
      {/*                        placeholder="输入价格"*/}
      {/*                        style={{fontSize: '14px'}}*/}
      {/*                        type="text"*/}
      {/*                        value={strategy.price}*/}
      {/*                        onChange={(e) => {*/}
      {/*                            const inputValue = e.target.value.replace(/[^\d.]/g, ''); // 只保留数字和小数点*/}
      {/*                            updatePriceList(index, 'price', inputValue);*/}
      {/*                        }}*/}
      {/*                        maxLength={7}*/}
      {/*                        required*/}
      {/*                    />*/}
      {/*                    <span onClick={() => delStrategy(index)}>删除</span>*/}
      {/*                </>*/}
      {/*            ) : (*/}
      {/*                <span*/}
      {/*                    className="text-[rgba(0,0,0,0.85)] text-3.5 font-not-italic font-400 lh-5.5">{strategy.price}元</span>*/}
      {/*            )}*/}
      {/*        </td>*/}
      {/*    </tr>*/}
      {/*))}*/}
      {/*{(!priceList || priceList.length < 4) && (*/}
      {/*    <tr>*/}
      {/*        <td colSpan={4} style={{textAlign: 'left', paddingTop: '24px'}}>*/}
      {/*            <button*/}
      {/*                className={'text-[#1DB48D] text-3.5 font-not-italic font-400 lh-5.5 underline'}*/}
      {/*                onClick={addNewStrategy}*/}
      {/*            >*/}
      {/*                + 添加新策略*/}
      {/*            </button>*/}
      {/*        </td>*/}
      {/*    </tr>*/}
      {/*)}*/}
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
export default Column;
