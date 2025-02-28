"use client"
import { type PostSelect } from "@/server/db/schema";
import { Button, Modal, Table, message, type TableColumnsType } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { time2DateTimeStringSeconds } from "@/tools/timeToString";
import Link from "next/link";
import { api } from "@/trpc/react";

interface TableComponentProps {
  dataSource: PostSelect[];
}

const TableComponent: React.FC<TableComponentProps> = ({ dataSource }) => {
  const [data, setData] = useState<PostSelect[]>([]);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  // API 调用
  const updateIsTopApi = api.post.updateIsTop.useMutation({
    onSuccess: () => {
      messageApi.success("更新成功");
      // refetch();
    },
    onError: () => {
      messageApi.error("操作失败");
    }
  });
  
  const updateIsFreeApi = api.post.updateIsFree.useMutation({
    onSuccess: () => {
      messageApi.success("更新成功");
      // refetch();
    },
    onError: () => {
      messageApi.error("操作失败");
    }
  });
  
  const deleteApi = api.post.deletePost.useMutation({
    onSuccess: () => {
      messageApi.success("删除成功");
      // refetch();
    },
    onError: () => {
      messageApi.error("删除失败");
    }
  });

  useEffect(() => {
    console.log("dataSource ==<>", dataSource);
    
    setData(dataSource || []);
  }, [dataSource]);

  // 处理函数
  const handleEdit = useCallback((postId: number) => {
    router.push(`/edit/edit?postId=${postId}`);
  }, [router]);

  const handleToggleTop = useCallback((id: number, isTop: boolean) => {
    updateIsTopApi.mutate({
      id: id,
      isTop: !isTop,
    });
    
    // 乐观更新UI
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, isTop: !isTop } : item
      )
    );
  }, [updateIsTopApi]);

  const handleToggleFree = useCallback((id: number, isFree: boolean) => {
    updateIsFreeApi.mutate({
      id: id,
      isFree: !isFree,
    });
    
    // 乐观更新UI
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, isFree: !isFree } : item
      )
    );
  }, [updateIsFreeApi]);

  const handleClickDelete = useCallback((id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇文章吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        deleteApi.mutate({ id });
        // 乐观更新UI
        setData(prevData => prevData.filter(item => item.id !== id));
      }
    });
  }, [deleteApi]);

  // 表格列定义
  const columns: TableColumnsType<PostSelect> = useMemo(() => [
    {
      title: <span className="pl-10">内容标题</span>,
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value) => <span className="pl-10">{value}</span>,
      width: "25%",
    },
    {
      title: "状态",
      dataIndex: "status",
      sorter: (a, b) => {
        if (a.isTop !== b.isTop) return a.isTop ? -1 : 1;
        if (a.isFree !== b.isFree) return a.isFree ? -1 : 1;
        return a.id - b.id;
      },
      filters: [
        { text: "免费", value: "free" },
        { text: "置顶", value: "top" },
      ],
      onFilter: (value, record) => {
        if (value === "free") return record.isFree;
        if (value === "top") return record.isTop;
        return false;
      },
      render: (_, record) => (
        <div className="flex items-center space-x-2.5 whitespace-nowrap">
          {record.isTop && (
            <div className="flex items-center">
              <span className="w-6px h-6px p0 bg-[#1DB48D] flex rounded-full"></span>
              <span className="text-14px ml-2">置顶</span>
            </div>
          )}
          {record.isFree && (
            <div className="flex items-center">
              <span className="w-6px h-6px p0 bg-[#FDB069] flex rounded-full"></span>
              <span className="text-14px ml-2">免费</span>
            </div>
          )}
        </div>
      ),
      width: "12.5%",
    },
    {
      title: "标签",
      dataIndex: "tag",
      sorter: (a, b) => {
        const tagLengthA = a.tag?.split(",").length || 0;
        const tagLengthB = b.tag?.split(",").length || 0;
        return tagLengthA - tagLengthB;
      },
      render: (tags) => {
        if (!tags) return null;
        const tagArray = tags.split(",").filter(tag => tag.trim() !== "");
        return (
          <div className="flex flex-col">
            {tagArray.map((tag, index) => (
              <span key={index} className="text-[#1DB48D]">
                #{tag.trim()}&nbsp;
              </span>
            ))}
          </div>
        );
      },
      width: "9%",
    },
    {
      title: <span className="whitespace-nowrap">更新时间</span>,
      dataIndex: "updatedAt",
      sorter: (a, b) => (a.updatedAt > b.updatedAt ? 1 : -1),
      render: (value) => <span>{time2DateTimeStringSeconds(value)}</span>,
      width: "15.5%",
    },
    {
      title: <span className="whitespace-nowrap">发布时间</span>,
      dataIndex: "createdAt",
      sorter: (a, b) => (a.createdAt > b.createdAt ? 1 : -1),
      render: (value) => <span>{time2DateTimeStringSeconds(value)}</span>,
      width: "15.5%",
    },
    {
      title: "操作",
      render: (_, record) => (
        <div className="text-3.5 font-400 lh-5.5 space-x-2 whitespace-nowrap">
          <Link
            href={`/writer/edit?postId=${record.id}`}
            className="text-[#1DB48D]"
          >
            编辑
          </Link>
          <Button
            type="link"
            style={{ color: "#1DB48D", padding: "0 4px" }}
            onClick={() => handleToggleTop(record.id, record.isTop)}
          >
            {record.isTop ? "取消置顶" : "置顶"}
          </Button>
          <Button
            type="link"
            style={{ color: "#1DB48D", padding: "0 4px" }}
            onClick={() => handleToggleFree(record.id, record.isFree)}
          >
            {record.isFree ? "取消免费" : "免费"}
          </Button>
          <Button
            type="link"
            danger
            style={{ padding: "0 4px" }}
            onClick={() => handleClickDelete(record.id)}
          >
            删除
          </Button>
        </div>
      ),
      width: "22.5%",
    },
  ], [handleToggleTop, handleToggleFree, handleClickDelete]);

  return (
    <>
      {contextHolder}
      <div className="overflow-x-auto min-h-[400px]">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            position: ['bottomCenter'],
          }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: "暂无数据",
          }}
          className="min-w-full"
          style={{ minHeight: '400px' }}
        />
      </div>
    </>
  );
};

export default TableComponent;