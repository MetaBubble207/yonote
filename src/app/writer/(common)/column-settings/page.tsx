"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { message, Switch } from "antd";
import { api } from "@/trpc/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import OSS from "ali-oss";
import W100H50Modal from "@/app/_components/common/W100H50Modal";
import { LoadingImage, NotImage } from "@/utils/DefaultPicture";

let client = new OSS({
  region: "oss-cn-shenzhen",
  accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
  accessKeySecret: process.env.NEXT_PUBLIC_ACCESS_KEY_SECRET,
  stsToken: process.env.NEXT_PUBLIC_STS_TOKEN,
  bucket: process.env.NEXT_PUBLIC_BUCKET,
});

const Page = () => {
  return (
    <Suspense>
      <div
        className={
          "rounded-2.5 flex h-full w-full items-start bg-[#FFF] pl-8 pt-8"
        }
      >
        <Suspense>
          <Table />
        </Suspense>
        {/*封面*/}
        <Suspense>
          <Cover />
        </Suspense>
      </div>
    </Suspense>
  );
};

export default Page;

function Table() {
  const params = useSearchParams();
  const columnId = params.get("columnId");
  const columnData = api.column.getColumnDetail.useQuery(
    columnId,
    { enabled: !!columnId },
  ).data;
  const priceListData = api.priceList.getByColumnId
    .useQuery({ columnId: columnId }, { enabled: !!columnId })
    .data?.sort((a, b) => a.id - b.id);
  const [name, setName] = useState(columnData?.name);
  const [priceList, setPriceList] = useState(priceListData);

  const [intro, setIntro] = useState(columnData?.introduce);
  const [description, setDescription] = useState(columnData?.description);
  const [checkColor, setCheckColor] = useState("#1DB48D");
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const onChange = (checked) => {
    setCheckColor(checked ? "#1DB48D" : "#fff");
  };
  useEffect(() => {
    setPriceList(priceListData);
  }, [priceListData]);

  const updateApi = api.column.update.useMutation({});
  const handleNameChange = (e) => setName(e.target.value);

  const submit = () => {
    console.log(priceList, priceListData);
    updateApi.mutate({
      id: columnId,
      name: name ?? columnData.name ?? "",
      priceList: priceList,
      introduce: intro ?? columnData.introduce ?? "",
      description: description ?? columnData.description ?? "",
    });
    setIsEditing(false);
    setShowConfirmSubmitModal(false);
  };

  const handleClickSubmit = () => {
    submit();
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
    if (priceList.length < 4) {
      // @ts-ignore
      setPriceList([...priceList, { price: 0, timeLimit: 0 }]);
    }
  };
  const delStrategy = (index) => {
    const newList = priceList.filter((_, i) => i !== index);
    setPriceList(newList);
  };
  const ConfirmSubmitModal = () => (
    <W100H50Modal>
      <div className={"text-6"}>是否确认更改专栏简介</div>
      <div className={"mt-5 space-x-10"}>
        <button
          className="w-22 b-1 b-rd-1 text-3.5 font-400 lh-5.5 ml-28 ml-4 mt-1 h-8 shrink-0 bg-[#eea1a1ff] text-[#eb172fff]"
          onClick={() => setShowConfirmSubmitModal(false)}
        >
          取消
        </button>
        <button
          className="w-22 bg-#DAF9F1 b-1 b-rd-1 font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-28 ml-4 mt-1 h-8 shrink-0 text-[#1DB48D]"
          onClick={submit}
        >
          确认
        </button>
      </div>
    </W100H50Modal>
  );

  return (
    <div>
      <div className="text-4 font-700 lh-6 w-16 text-[#323232]">专栏设置</div>
      <table className={"ml-20.5"}>
        <tbody>
          {/*名称*/}
          <tr>
            <td style={{ textAlign: "right", paddingTop: "24px" }}>
              <span style={{ color: "red" }}>*</span>
              <label
                className={
                  "text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]"
                }
              >
                名称：
              </label>
            </td>
            <td style={{ textAlign: "left", paddingTop: "24px" }}>
              {isEditing ? (
                <input
                  className="w-117 border-rd-1 border-1 h-8 shrink-0 border-solid border-[#D9D9D9] bg-[#FFF] pl-3 text-lg"
                  placeholder="最多输入十五个字"
                  style={{ fontSize: "14px" }}
                  type="text"
                  value={name ?? columnData?.name ?? ""}
                  onChange={handleNameChange}
                  maxLength={15}
                  required
                />
              ) : (
                <span className="text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]">
                  {name ?? columnData?.name ?? ""}
                </span>
              )}
            </td>
          </tr>
          {/*消费模式*/}
          <tr>
            <td style={{ textAlign: "right", paddingTop: "24px" }}>
              <span style={{ color: "red" }}>*</span>
              <span
                className={
                  "text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]"
                }
              >
                消费模式：
              </span>
            </td>
            <td style={{ textAlign: "left", paddingTop: "24px" }}>
              <span
                className={
                  "text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.65)]"
                }
              >
                一口价
              </span>
            </td>
          </tr>
          {/*内容形式*/}
          <tr>
            <td style={{ textAlign: "right", paddingTop: "24px" }}>
              <span style={{ color: "red" }}>*</span>
              <span
                className={
                  "text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]"
                }
              >
                内容形式：
              </span>
            </td>
            <td style={{ textAlign: "left", paddingTop: "24px" }}>
              <span
                className={
                  "text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.65)]"
                }
              >
                图文专栏
              </span>
            </td>
          </tr>
          {/*价格*/}
          {priceList?.map((strategy, index) => (
            <tr key={index}>
              <td style={{ paddingTop: "24px" }}>
                {isEditing ? (
                  <>
                    <input
                      className={
                        "border-rd-1 border-1 h-8 w-40 border-solid border-[#D9D9D9] bg-[#FFF] pl-3"
                      }
                      placeholder="大于99998天即为永久"
                      style={{ fontSize: "14px" }}
                      type="text"
                      value={strategy.timeLimit}
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, ""); // 只保留数字
                        updatePriceList(index, "timeLimit", inputValue);
                      }}
                      maxLength={7}
                      required
                    />
                    天：
                  </>
                ) : (
                  <span className="text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]">
                    {strategy.timeLimit >= 99999
                      ? "永久买断价格："
                      : `限时购买价格(${strategy.timeLimit}天)：`}
                  </span>
                )}
              </td>
              <td style={{ textAlign: "left", paddingTop: "24px" }}>
                {isEditing ? (
                  <>
                    <input
                      className={
                        "w-117 border-rd-1 border-1 h-8 border-solid border-[#D9D9D9] bg-[#FFF] pl-3"
                      }
                      placeholder="输入价格"
                      style={{ fontSize: "14px" }}
                      type="text"
                      value={strategy.price}
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(
                          /[^\d.]/g,
                          "",
                        ); // 只保留数字和小数点
                        updatePriceList(index, "price", inputValue);
                      }}
                      maxLength={7}
                      required
                    />
                    <span onClick={() => delStrategy(index)}>删除</span>
                  </>
                ) : (
                  <span className="text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]">
                    {strategy.price}元
                  </span>
                )}
              </td>
            </tr>
          ))}
          {isEditing && priceList.length < 4 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "left", paddingTop: "24px" }}>
                <button
                  className={
                    "text-3.5 font-not-italic font-400 lh-5.5 text-[#1DB48D] underline"
                  }
                  onClick={addNewStrategy}
                >
                  + 添加新策略
                </button>
              </td>
            </tr>
          )}
          {/*简介*/}
          <tr>
            <td style={{ textAlign: "right", paddingTop: "24px" }}>
              <span style={{ color: "red" }}>*</span>
              <span
                className={
                  "text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]"
                }
              >
                简介：
              </span>
            </td>
            <td style={{ textAlign: "left", paddingTop: "24px" }}>
              {isEditing ? (
                <textarea
                  className={
                    "w-117 h-30 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3"
                  }
                  placeholder="请输入专栏简介"
                  style={{ fontSize: "14px" }}
                  value={intro ?? columnData?.introduce ?? ""}
                  onChange={(e) => setIntro(e.target.value)}
                  required
                />
              ) : (
                <span className="w-117 max-h-30 text-3.5 font-not-italic font-400 lh-5.5 block overflow-hidden overflow-ellipsis text-[rgba(0,0,0,0.85)]">
                  {intro ?? columnData?.introduce ?? ""}
                </span>
              )}
            </td>
          </tr>
          {/*详情*/}
          <tr>
            <td style={{ textAlign: "right", paddingTop: "24px" }}>
              <span style={{ color: "red" }}>*</span>
              <span
                className={
                  "text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]"
                }
              >
                详情：
              </span>
            </td>
            <td style={{ textAlign: "left", paddingTop: "24px" }}>
              {isEditing ? (
                <textarea
                  className={
                    "w-117 h-30 border-rd-1 border-1 border-solid border-[#D9D9D9] bg-[#FFF] pl-3"
                  }
                  placeholder="请输入专栏详情"
                  style={{ fontSize: "14px" }}
                  value={description ?? columnData?.description ?? ""}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              ) : (
                <span className="w-117 max-h-30 text-3.5 font-not-italic font-400 lh-5.5 block overflow-hidden overflow-ellipsis text-[rgba(0,0,0,0.85)]">
                  {description ?? columnData?.description ?? ""}
                </span>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "right", paddingTop: "24px" }}>
              <span
                className={
                  "text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]"
                }
              >
                禁止复制：
              </span>
            </td>
            <td style={{ textAlign: "left", paddingTop: "24px" }}>
              <span
                className={
                  "text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.65)]"
                }
              >
                {/*<ConfigProvider*/}
                {/*    theme={{*/}
                {/*        components: {*/}
                {/*            Switch: {*/}
                {/*                // handleBg:"#000"*/}
                {/*            },*/}
                {/*        },*/}
                {/*    }}*/}
                {/*>*/}
                <Switch
                  defaultChecked
                  style={{ background: checkColor }}
                  onChange={onChange}
                />
                {/*</ConfigProvider>*/}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className={"ml-20.5 mt-10"}>
        {isEditing ? (
          <>
            <button
              className={
                "w-22 b-1 b-rd-1 font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-28 ml-4 mt-1 h-8 shrink-0 bg-[#DAF9F1] text-[#1DB48D]"
              }
              onClick={handleClickSubmit}
            >
              提交
            </button>
            <button
              className={
                "w-22 b-1 b-rd-1 text-3.5 font-400 lh-5.5 ml-28 ml-4 mt-1 h-8 shrink-0 bg-[#eea1a1ff] text-[#eb172fff]"
              }
              onClick={() => setIsEditing(false)}
            >
              取消
            </button>
          </>
        ) : (
          <button
            className={
              "w-22 b-1 b-rd-1 font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-28 ml-4 mt-1 h-8 shrink-0 bg-[#DAF9F1] text-[#1DB48D]"
            }
            onClick={() => setIsEditing(true)}
          >
            编辑
          </button>
        )}
      </div>
      {contextHolder}
      {showConfirmSubmitModal && <ConfirmSubmitModal />}
    </div>
  );
}

function Cover() {
  const fileInputRef = useRef(null);
  const params = useSearchParams();
  const columnId = params.get("columnId");
  const columnData = api.column.getColumnDetail.useQuery(
    columnId,
    { enabled: !!columnId },
  ).data;
  const [cover, setCover] = useState(columnData?.cover);

  const updateCoverApi = api.column.updateCover.useMutation({
    onSuccess: (r) => {
      console.log(r);
    },
  });

  useEffect(() => {
    setCover(columnData?.cover);
  }, [columnData]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await client.put(file.name, file);
        updateCoverApi.mutate({ id: columnId, cover: result.url });
        setCover(result.url);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };

  const changeCover = () => {
    fileInputRef.current.click();
  };
  return (
    <div className={"mt-50 ml-10 flex items-center"}>
      <div>
        <span className={"text-3.5 font-not-italic font-400 lh-5.5"}>
          封面：
        </span>
      </div>
      <div>
        <div>
          <div className="w-29 h-37.5 relative">
            <Image
              placeholder="blur"
              blurDataURL={LoadingImage()}
              src={cover ?? NotImage()}
              alt="cover"
              quality={100}
              fill
              loading="lazy"
              className="object-cover"
            />
          </div>
          <div
            className={
              "w-19.5 border-rd-4 mx-auto mt-5 flex h-6 shrink-0 items-center bg-[#45E1B8] pl-2.5"
            }
          >
            <Image
              className={"w-3.477 h-3.477"}
              src={"/images/user/Edit.svg"}
              alt={"头像"}
              width={"10"}
              height={"10"}
            />
            <button
              className="ml-1.25 text-2.5 font-500 lh-6 w-10 text-[#252525]"
              onClick={changeCover}
            >
              修改封面
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
