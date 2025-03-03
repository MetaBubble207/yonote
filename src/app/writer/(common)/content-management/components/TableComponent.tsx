"use client"
import { type PostSelect } from "@/server/db/schema";
import { Button, Modal, Table, message, type TableColumnsType } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { date2DateTimeStringSeconds } from "@/app/_utils/timeToString";
import Link from "next/link";
import { api } from "@/trpc/react";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useRouter, useSearchParams } from "next/navigation";
interface TableComponentProps {
  dataSource: PostSelect[];
  total: number;
}

const TableComponent: React.FC<TableComponentProps> = ({ dataSource, total }) => {
  const [data, setData] = useState<PostSelect[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
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
    },
    onError: () => {
      messageApi.error("删除失败");
    }
  });

  useEffect(() => {
    setData(dataSource || []);
  }, [dataSource]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleTableChange = (pagination: any, filter: any, sorter: any) => {
    const params = new URLSearchParams(searchParams.toString());
    // 更新分页参数
    params.set("currentPage", String(pagination.current));
    params.set("pageSize", String(pagination.pageSize));
    // 更新排序参数
    if (sorter.field) {
      params.set("sortField", sorter.field);
      params.set("sortOrder", sorter.order);
    }
    if (filter.status) {
      filter.status.map((item: string) => {
        params.set(item, "true")
      })
    } else {
      params.delete("isFree");
      params.delete("isTop");
    }
    router.push(`?${params.toString()}`);
  };

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

  const handleClickDelete = (id: number) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (deleteId) {
      deleteApi.mutate({ id: deleteId });
      // 乐观更新UI
      setData(prevData => prevData.filter(item => item.id !== deleteId));
    }
    setIsModalOpen(false);
    setDeleteId(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDeleteId(null);
    messageApi.info("已取消删除");
  };

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
        { text: "免费", value: "isFree" },
        { text: "置顶", value: "isTop" },
      ],
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
      render: (tags: string) => {
        if (!tags) return null;
        const tagArray = tags.split(",").filter(tag => tag.trim() !== "");
        return (
          <div className="flex flex-wrap">
            {tagArray.map((tag, index) => (
              <span key={index} className="text-[#1DB48D] max-w-200px overflow-ellipsis">
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
      render: (value) => <span>{date2DateTimeStringSeconds(value)}</span>,
      width: "15.5%",
    },
    {
      title: <span className="whitespace-nowrap">发布时间</span>,
      dataIndex: "createdAt",
      sorter: (a, b) => (a.createdAt > b.createdAt ? 1 : -1),
      render: (value) => <span>{date2DateTimeStringSeconds(value)}</span>,
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
      <Modal
        title="确认删除"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <div className="flex items-center">
          <ExclamationCircleFilled className="text-[#faad14] text-[22px] mr-2" />
          <span>确定要删除这篇文章吗？此操作不可恢复😯</span>
        </div>
      </Modal>
      <div className="overflow-x-auto min-h-[400px]">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          onChange={handleTableChange}
          pagination={{
            current: Number(searchParams.get("currentPage")) || 1,
            pageSize: Number(searchParams.get("pageSize")) || 10,
            showSizeChanger: true,
            showQuickJumper: true,
            total: total,
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