"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Switch, Button, message, Table, Space, Modal } from "antd";
import { api } from "@/trpc/react";
import W100H50Modal from "@/app/_components/common/W100H50Modal";
import type { ColumnSelect, PriceListSelect } from "@/server/db/schema";
import "../style/table.css"

interface ColumnSettingsTableProps {
    columnData: ColumnSelect;
    priceListData: PriceListSelect[];
}

// 定义表单数据类型
interface FormData {
    name: string;
    introduce: string;
    description: string;
    priceList: PriceListSelect[];
}

const ColumnSettingsTable: React.FC<ColumnSettingsTableProps> = ({
    columnData,
    priceListData
}) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [checkColor, setCheckColor] = useState("#1DB48D");

    // 使用单独的状态维护表单数据
    const [formData, setFormData] = useState<FormData>({
        name: columnData?.name || "",
        introduce: columnData?.introduce || "",
        description: columnData?.description || "",
        priceList: [...(priceListData || [])]
    });

    // 同步props数据到state
    useEffect(() => {
        setFormData({
            name: columnData?.name || "",
            introduce: columnData?.introduce || "",
            description: columnData?.description || "",
            priceList: [...(priceListData || [])]
        });
    }, [columnData, priceListData]);

    const updateApi = api.column.update.useMutation({
        onSuccess: (data) => {
            messageApi.success("专栏设置已更新");
            setIsEditing(false);

            // 如果后端返回了更新后的数据，直接使用
            if (data && data.column && data.priceList) {
                setFormData({
                    name: data.column.name || "",
                    introduce: data.column.introduce || "",
                    description: data.column.description || "",
                    priceList: [...data.priceList]
                });
            }
        },
        onError: (error) => {
            messageApi.error(`更新失败: ${error.message}`);
        }
    });

    const handleSubmit = () => {
        form.validateFields().then(values => {
            updateApi.mutate({
                id: columnData?.id || "",
                name: values.name,
                priceList: formData.priceList,
                introduce: values.introduce,
                description: values.description,
            });
            setShowConfirmModal(false);
        });
    };

    const updatePriceList = (index: number, key: string, value: any) => {
        try {
            // 检查输入是否为纯数字且不能是0开头，但是可以是0
            if (value.startsWith("0") && value !== "0") {
                messageApi.info("输入的价格不能以0开头");
                return false;
            }
            const numValue = Number(value);

            if (key === "price") {
                if (isNaN(numValue)) {
                    messageApi.info("输入的价格不是合法的数字噢😯~");
                    return false;
                }
            }

            if (key === "timeLimit") {
                if (isNaN(numValue)) {
                    messageApi.info("输入的天数不是纯数字噢😯~");
                    return false;
                }

                // 检查是否已经存在永久专栏
                if (numValue >= 99999) {
                    const hasForever = formData.priceList.some((item, idx) => idx !== index && item.timeLimit >= 99999);
                    if (hasForever) {
                        messageApi.info("超过99998天就是永久专栏了，已经拥有一个永久专栏了，不能再添加了噢~");
                        return false;
                    }
                }

                // 检查是否有重复的天数
                const hasDuplicate = formData.priceList.some((item, idx) =>
                    idx !== index && item.timeLimit === numValue
                );
                if (hasDuplicate) {
                    messageApi.info("已经存在相同天数的价格策略了，请设置不同的天数~");
                    return false;
                }
            }

            // 创建新的价格列表，避免直接修改状态
            const newPriceList = [...formData.priceList];

            // 确保所有必需的属性都存在，避免undefined值
            newPriceList[index] = {
                ...newPriceList[index],
                [key]: numValue,
                id: newPriceList[index]?.id || 0,
                columnId: newPriceList[index]?.columnId || "",
                price: key === "price" ? numValue : (newPriceList[index]?.price || 0),
                timeLimit: key === "timeLimit" ? numValue : (newPriceList[index]?.timeLimit || 0),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // 更新整个表单数据
            setFormData({
                ...formData,
                priceList: newPriceList
            });
        } catch (e) {
            messageApi.error("输入有误，请检查");
        }
    };

    const addNewStrategy = () => {
        if (formData.priceList.length < 4) {
            const newPriceList = [
                ...formData.priceList,
                {
                    id: Date.now(),
                    price: 0,
                    timeLimit: 0,
                    columnId: columnData?.id || "",
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            setFormData({
                ...formData,
                priceList: newPriceList
            });
        } else {
            messageApi.info("最多只能添加4个价格策略");
        }
    };

    const deleteStrategy = (index: number) => {
        const newPriceList = formData.priceList.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            priceList: newPriceList
        });
    };

    const onSwitchChange = (checked: boolean) => {
        setCheckColor(checked ? "#1DB48D" : "#fff");
    };

    const startEditing = () => {
        form.setFieldsValue({
            name: formData.name,
            introduce: formData.introduce,
            description: formData.description,
        });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        // 重置为原始数据
        setFormData({
            name: columnData?.name || "",
            introduce: columnData?.introduce || "",
            description: columnData?.description || "",
            priceList: [...(priceListData || [])]
        });
        form.resetFields();
    };

    // 修改表格宽度，使编辑前后保持一致
    const columns = [
        {
            title: '天数',
            dataIndex: 'timeLimit',
            key: 'timeLimit',
            width: 160,
            render: (text: number, record: PriceListSelect, index: number) => (
                isEditing ? (
                    <Input
                        className="border-rd-1 border-1 h-8 w-32 border-solid border-[#D9D9D9] bg-[#FFF] pl-3"
                        placeholder="大于99998天即为永久"
                        style={{ fontSize: "14px" }}
                        value={text}
                        onChange={(e) => {
                            updatePriceList(index, "timeLimit", e.target.value);
                        }}
                        maxLength={7}
                    />
                ) : (
                    <span className="text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]">
                        {text >= 99999 ? "永久买断" : `${text}天`}
                    </span>
                )
            ),
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: 160,
            render: (text: number, record: PriceListSelect, index: number) => (
                isEditing ? (
                    <Input
                        className="border-rd-1 border-1 h-8 w-32 border-solid border-[#D9D9D9] bg-[#FFF] pl-3"
                        placeholder="输入价格"
                        style={{ fontSize: "14px" }}
                        value={text}
                        onChange={(e) => {
                            updatePriceList(index, "price", e.target.value);
                        }}
                        maxLength={7}
                    />
                ) : (
                    <span className="text-3.5 font-not-italic font-400 lh-5.5 text-[rgba(0,0,0,0.85)]">
                        {text}元
                    </span>
                )
            ),
        },
        ...(isEditing ? [{
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: any, __: any, index: number) => (
                <Button
                    type="link"
                    className="text-[#ff4d4f] p-0"
                    onClick={() => deleteStrategy(index)}
                >
                    删除
                </Button>
            ),
        }] : []),
    ];

    return (
        <div className="pr-8 pb-8 w-600px">
            {contextHolder}
            <div className="text-4 font-700 lh-6 w-16 text-[#323232] mb-6">专栏设置</div>

            <Form
                form={form}
                initialValues={{
                    name: formData.name,
                    introduce: formData.introduce,
                    description: formData.description,
                }}
                className="ml-20.5"
            >
                <div className="mb-6">
                    <Form.Item
                        label={<span className="text-3.5 font-400 lh-5.5">名称</span>}
                        name="name"
                        required
                        rules={[{ required: true, message: '请输入专栏名称' }]}
                        className="flex items-center m-0"
                    >
                        {isEditing ? (
                            <Input
                                className="w-117 border-rd-1 h-8"
                                placeholder="最多输入十五个字"
                                maxLength={15}
                            />
                        ) : (
                            <div className="text-3.5 font-400 lh-5.5 text-[rgba(0,0,0,0.85)]">
                                {formData.name}
                            </div>
                        )}
                    </Form.Item>
                </div>

                <div className="mb-6">
                    <Form.Item
                        label={<span className="text-3.5 font-400 lh-5.5">消费模式</span>}
                        required
                    >
                        <div className="text-3.5 font-400 lh-5.5 text-[rgba(0,0,0,0.65)]">
                            一口价
                        </div>
                    </Form.Item>
                </div>

                <div className="mb-6">
                    <Form.Item
                        label={<span className="text-3.5 font-400 lh-5.5">内容形式</span>}
                        required
                    >
                        <div className="text-3.5 font-400 lh-5.5 text-[rgba(0,0,0,0.65)]">
                            图文专栏
                        </div>
                    </Form.Item>
                </div>

                <div className="mb-6">
                    <Form.Item
                        label={<span className="text-3.5 font-400 lh-5.5 max-h-200px">价格策略</span>}
                        required
                    >
                        <Table
                            dataSource={formData.priceList}
                            columns={columns}
                            pagination={false}
                            rowKey="id"
                            size="small"
                            className="mb-4"
                            bordered={false}
                            style={{ width: 400 }}
                            scroll={{ x: 400 }}
                            rowClassName="h-10"
                        />

                        {isEditing && formData.priceList.length < 4 && (
                            <Button
                                type="link"
                                className="text-[#1DB48D] underline p-0"
                                onClick={addNewStrategy}
                            >
                                + 添加新策略
                            </Button>
                        )}
                    </Form.Item>
                </div>

                <div className="mb-6">
                    <Form.Item
                        label={<span className="text-3.5 font-400 lh-5.5">简介</span>}
                        name="introduce"
                        required
                        rules={[{ required: true, message: '请输入专栏简介' }]}
                    >
                        {isEditing ? (
                            <Input.TextArea
                                className="w-117 h-30"
                                placeholder="请输入专栏简介"
                            />
                        ) : (
                            <div className="w-117 max-h-30 text-3.5 font-400 lh-5.5 overflow-hidden overflow-ellipsis">
                                {formData.introduce}
                            </div>
                        )}
                    </Form.Item>
                </div>

                <div className="mb-6">
                    <Form.Item
                        label={<span className="text-3.5 font-400 lh-5.5">详情</span>}
                        name="description"
                        required
                        rules={[{ required: true, message: '请输入专栏详情' }]}
                    >
                        {isEditing ? (
                            <Input.TextArea
                                className="w-117 h-30"
                                placeholder="请输入专栏详情"
                            />
                        ) : (
                            <div className="w-117 max-h-30 text-3.5 font-400 lh-5.5 overflow-hidden overflow-ellipsis">
                                {formData.description}
                            </div>
                        )}
                    </Form.Item>
                </div>

                <div className="mb-6">
                    <Form.Item
                        label={<span className="text-3.5 font-400 lh-5.5">禁止复制</span>}
                    >
                        <Switch
                            defaultChecked
                            style={{ background: checkColor }}
                            onChange={onSwitchChange}
                        />
                    </Form.Item>
                </div>

                <div className="mt-10">
                    {isEditing ? (
                        <Space>
                            <Button
                                className="w-22 h-8 bg-[#DAF9F1] text-[#1DB48D] border border-solid"
                                onClick={() => setShowConfirmModal(true)}
                            >
                                提交
                            </Button>
                            <Button
                                className="w-22 h-8 bg-[#eea1a1ff] text-[#eb172fff] border border-solid"
                                onClick={cancelEditing}
                            >
                                取消
                            </Button>
                        </Space>
                    ) : (
                        <Button
                            className="w-22 h-8 bg-[#DAF9F1] text-[#1DB48D] border border-solid"
                            onClick={startEditing}
                        >
                            编辑
                        </Button>
                    )}
                </div>
            </Form>

            <Modal open={showConfirmModal} onOk={handleSubmit}
                onCancel={() => setShowConfirmModal(false)} title={"保存确认框"}>
                <div>是否确认更改专栏设置</div>
            </Modal>
        </div>
    );
};

export default ColumnSettingsTable;