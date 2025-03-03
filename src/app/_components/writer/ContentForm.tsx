"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { time2DateString } from "@/app/_utils/timeToString";
import { useSearchParams } from "next/navigation";
import W100H50Modal from "@/app/_components/common/W100H50Modal";
import Link from "next/link";

const ContentForm = ({ title, tag }) => {
  const params = useSearchParams();
  const columnId = params.get("columnId");
  const [data, setData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(0);
  const queryResult = api.post.getAll.useQuery({
    columnId: columnId,
  });

  const [contentData, setContentData] = useState([]);

  useEffect(() => {
    if (queryResult.data) {
      const filteredData = queryResult.data.filter(
        (item) => item.status !== false,
      );
      setContentData(filteredData);
    }
  }, [queryResult.data]);

  useEffect(() => {
    console.log(contentData);
  }, [contentData]);

  useEffect(() => {
    if (title || tag) {
      const filteredData = queryResult.data.filter(
        (item) =>
          (title ? item.name.includes(title) : true) &&
          (tag ? item.tag.includes(tag) : true),
      );
      setContentData(filteredData);
    } else {
      setContentData(queryResult.data);
    }
  }, [title, tag, queryResult.data]);

  const { data: queryData, isLoading, isError } = api.post.getByName.useQuery();
  useEffect(() => {
    if (queryData) {
      setData(queryData);
    }
  }, [queryData]);

  const updateIsTopApi = api.post.updateIsTop.useMutation({
    onSuccess: (r) => {
      console.log(r);
    },
  });
  const updateIsFreeApi = api.post.updateIsFree.useMutation({
    onSuccess: (r) => {
      console.log(r);
    },
  });
  const deleteApi = api.post.deletePost.useMutation({
    onSuccess: (r) => {
      console.log(r);
    },
  });
  const handleEdit = (postId) => {
    // 编辑文章逻辑
    // router.push(`/edit?postId=${postId}`);
  };

  const handleToggleTop = (index) => {
    // 切换置顶状态逻辑
    const newData = [...contentData];
    newData[index].isTop = !newData[index].isTop;

    setContentData(newData);
    updateIsTopApi.mutate({
      id: newData[index].id,
      isTop: newData[index].isTop,
    });
  };

  const handleToggleFree = (index) => {
    // 切换免费状态逻辑
    const newData = [...contentData];
    newData[index].isFree = !newData[index].isFree;
    setContentData(newData);
    updateIsFreeApi.mutate({
      id: newData[index].id,
      isFree: newData[index].isFree,
    });
  };
  const deletePost = () => {
    const newData = [...contentData];
    setContentData(newData.filter((item) => item.id !== currentDeleteId));
    // 删除文章逻辑
    deleteApi.mutate({
      id: currentDeleteId,
    });
    setShowDeleteModal(false);
  };

  const DeleteModal = () => {
    return (
      <W100H50Modal>
        <div className={"text-6"}>是否确认要删除</div>
        <div className={"mt-5 space-x-10"}>
          <button
            className="w-22 b-1 b-rd-1 text-3.5 font-400 lh-5.5 ml-28 ml-4 mt-1 h-8 shrink-0 bg-[#eea1a1ff] text-[#eb172fff]"
            onClick={() => setShowDeleteModal(false)}
          >
            取消
          </button>
          <button
            className="w-22 bg-#DAF9F1 b-1 b-rd-1 font-Abel text-3.5 font-not-italic font-400 lh-5.5 ml-28 ml-4 mt-1 h-8 shrink-0 text-[#1DB48D]"
            onClick={deletePost}
          >
            确认
          </button>
        </div>
      </W100H50Modal>
    );
  };
  const handleClickDelete = (index) => {
    setCurrentDeleteId(index);

    setShowDeleteModal(true);
  };
  return (
    <div>
      {/*表格*/}
      <table className="w-94% mt-22px mx-35px pl-63px">
        <thead className={"border-rd-1 bg-[#FAFAFA]"}>
          <tr className={"h-54px"}>
            <th className="pl-63px text-3.5 font-not-italic font-400 lh-5.5 px-4 pr-2 text-left text-[rgba(0,0,0,0.85)]">
              内容标题
            </th>
            <th className="text-3.5 font-not-italic font-400 lh-5.5 px-4 py-2 text-left text-[rgba(0,0,0,0.85)]">
              <div className={"flex items-center"}>
                <span>状态</span>
                <span className={"ml-8px"}>
                  <Image
                    src={"/images/writer/management/state.png"}
                    alt={"状态图标"}
                    width={10}
                    height={10}
                  />
                </span>
              </div>
            </th>
            <th className="text-3.5 font-not-italic font-400 lh-5.5 px-4 py-2 text-left text-[rgba(0,0,0,0.85)]">
              <div className={"flex items-center"}>
                <span>标签</span>
                <span className={"ml-8px"}>
                  <Image
                    src={"/images/writer/management/sort.png"}
                    alt={"标签排序图标"}
                    width={12}
                    height={12}
                  />
                </span>
              </div>
            </th>
            <th className="text-3.5 font-not-italic font-400 lh-5.5 px-4 py-2 text-left text-[rgba(0,0,0,0.85)]">
              <div className={"flex items-center"}>
                <span>更新时间</span>
                <span className={"ml-8px"}>
                  <Image
                    src={"/images/writer/management/sort2.png"}
                    alt={"更新时间排序图标"}
                    width={12}
                    height={12}
                  />
                </span>
              </div>
            </th>
            <th className="text-3.5 font-not-italic font-400 lh-5.5 px-4 py-2 text-left text-[rgba(0,0,0,0.85)]">
              <div className={"flex items-center"}>
                <span>发布时间</span>
                <span className={"ml-8px"}>
                  <Image
                    src={"/images/writer/management/sort2.png"}
                    alt={"更新时间排序图标"}
                    width={12}
                    height={12}
                  />
                </span>
              </div>
            </th>
            <th className="text-3.5 font-not-italic font-400 lh-5.5 px-4 py-2 text-left text-[rgba(0,0,0,0.85)]">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {contentData?.map((option, index) => (
            <tr key={index} className={"h-52px"}>
              <td className="pl-63px text-3.5 font-not-italic font-400 lh-5.5 px-4 pr-2 text-left text-[rgba(0,0,0,0.65)]">
                {option?.name}
              </td>
              <td
                className={`text-3.5 font-not-italic font-400 lh-5.5 px-4 py-2 text-[rgba(0,0,0,0.65)] ${option.isTop ? "text-[#1DB48D]" : ""} ${option.isFree ? "text-[#1DB48D]" : ""}`}
              >
                {option.isTop ? "置顶" : ""} {option.isFree ? "免费" : ""}
              </td>
              <td className="text-3.5 font-not-italic font-400 lh-5.5 px-4 py-2 text-[rgba(0,0,0,0.65)]">
                {option.tag}
              </td>
              <td className="text-3.5 font-not-italic font-400 lh-5.5 px-4 py-2 text-[rgba(0,0,0,0.65)]">
                {time2DateString(option.createdAt)}
              </td>
              <td className="text-3.5 font-not-italic font-400 lh-5.5 px-4 py-2 text-[rgba(0,0,0,0.65)]">
                {time2DateString(option.updatedAt)}
              </td>
              <td className="px-4 py-2">
                <Link
                  href={`/edit/edit?columnId=${columnId}&postId=${option.id}`}
                  className="text-3.5 font-not-italic font-400 lh-5.5 mr-2 text-[#1DB48D]"
                  onClick={handleEdit}
                >
                  编辑
                </Link>
                <button
                  className="text-3.5 font-not-italic font-400 lh-5.5 mr-2 text-[#1DB48D]"
                  onClick={() => handleToggleTop(index)}
                >
                  {option.isTop ? "取消置顶" : "置顶"}
                </button>
                <button
                  className="text-3.5 font-not-italic font-400 lh-5.5 mr-2 text-[#1DB48D]"
                  onClick={() => handleToggleFree(index)}
                >
                  {option.isFree ? "取消免费" : "免费"}{" "}
                </button>
                <button
                  className={
                    "text-3.5 font-not-italic font-400 lh-5.5 mr-2 text-[#1DB48D]"
                  }
                  onClick={() => handleClickDelete(option.id)}
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default ContentForm;
