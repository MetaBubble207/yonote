"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, DatePicker, Input } from "antd";
import { api } from "@/trpc/react";
import TableComponent from "@/app/_components/writer/content/TableComponent";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import Loading from "@/app/_components/common/Loading";

const ContentManagement = () => {
  const params = useSearchParams();
  const router = useRouter();
  const columnId = params.get("columnId");
  const [isGo, setIsGo] = useState(false);

  const [queryParams, setQueryParams] = useState({
    title: "",
    tag: "",
    startDate: null,
    endDate: null,
  });

  const {
    data: posts,
    refetch,
    isLoading,
  } = api.post.getPostFilter.useQuery(
    {
      columnId: columnId,
      title: queryParams.title,
      tag: queryParams.tag,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
    },
    { enabled: Boolean(columnId) },
  );

  useEffect(() => {
    if (isGo) router.push(`/edit/edit?columnId=${columnId}`);
  }, [columnId, isGo, router]);

  if (isLoading) return <Loading />;
  return (
    <div className={"rounded-2.5 h-full w-full bg-[#FFF] pl-8 pr-9"}>
      <div className={"pt-51px flex items-center"}>
        <div className="text-4 font-not-italic font-700 lh-6 text-[#323232]">
          内容管理
        </div>
        {/*发布*/}
        <div
          onClick={() => setIsGo(true)}
          className={
            "h-32px border-rd-1 px-16px lh-32px ml-32px inline-block bg-[rgba(69,225,184,0.20)] text-[#1db48d]"
          }
        >
          + 发布
        </div>
      </div>
      <ConditionalFiltering />
      {/*表格*/}
      <div className={"mt-4"}>
        {/*@ts-ignore*/}
        <TableComponent dataSource={posts} />
      </div>
    </div>
  );

  function ConditionalFiltering() {
    const dateFormat = "YYYY/MM/DD";

    const [searchParams, setSearchParams] = useState({
      title: "",
      tag: "",
      startDate: null,
      endDate: null,
    });

    useEffect(() => {
      setSearchParams({ ...queryParams });
    }, []);

    const handleSearch = () => {
      setQueryParams({
        title: searchParams.title,
        tag: searchParams.tag,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
      });
      refetch(); // 在点击查询按钮时才触发重新获取数据
    };

    const onTitleChange = (e) => {
      setSearchParams((prevState) => ({ ...prevState, title: e.target.value }));
    };

    const onTagChange = (e) => {
      setSearchParams((prevState) => ({ ...prevState, tag: e.target.value }));
    };

    const onDateChange = (date) => {
      const [date1, date2] = date;
      setSearchParams((prev) => ({
        ...prev,
        startDate: date1 ? date1.toDate() : null,
        endDate: date2 ? date2.toDate() : null,
      }));
    };

    const disabledDate = (currentDate) => {
      return currentDate.isAfter(dayjs(), "day");
    };

    return (
      <div className={"mt-7.5 text-3.5 font-400 flex items-center"}>
        <div className={"flex items-center"}>
          <label className="lh-5.5 whitespace-nowrap">内容标题：</label>
          <Input
            className="rounded-1 border-1 ml-4 h-8 w-56 border-solid border-[#D9D9D9] bg-[#FFF]"
            type="text"
            placeholder="搜索标题"
            value={searchParams.title}
            onChange={onTitleChange}
            allowClear
          />
        </div>

        <div className={"ml-32px flex items-center"}>
          <label className="lh-5.5 whitespace-nowrap">标签：</label>
          <Input
            className="rounded-1 border-1 ml-4 h-8 w-56 border-solid border-[#D9D9D9] bg-[#FFF]"
            type="text"
            placeholder="不限"
            value={searchParams.tag}
            onChange={onTagChange}
            allowClear
          />
        </div>
        <div className={"ml-32px flex items-center"}>
          <label className="text-3.5 font-400 lh-5.5 mr-2.5 whitespace-nowrap">
            发布时间：
          </label>
          <DatePicker.RangePicker
            allowClear
            value={[
              searchParams.startDate ? dayjs(searchParams.startDate) : null,
              searchParams.endDate ? dayjs(searchParams.endDate) : null,
            ]}
            format={dateFormat}
            onChange={onDateChange}
            disabledDate={(currentDate) => disabledDate(currentDate)}
          />
        </div>
        <div className={"rounded-1 mx-56px h-8 w-16"}>
          <Button
            className={"p0 b-0"}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#1DB48D",
              color: "#fff",
            }}
            onClick={handleSearch}
          >
            查询
          </Button>
        </div>
      </div>
    );
  }
};

const Page = () => {
  return (
    <Suspense>
      <ContentManagement />
    </Suspense>
  );
};
export default Page;
