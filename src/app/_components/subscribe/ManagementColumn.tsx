"use client"
import Image from "next/image"
import {Checkbox, message} from 'antd';
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import useLocalStorage from "@/tools/useStore";
import {api} from "@/trpc/react";

// eslint-disable-next-line react/display-name
const ManagementColumn = forwardRef(
    (props: any, ref) => {
        useImperativeHandle(
            ref,
            () => ({handleSave})
        );
        const token = useLocalStorage("token", '');
        const order = api.order.getUserOrderDefault.useQuery({
            userId: token[0],
        });
        const column = api.column.getOrderColumn.useQuery({userId: token[0]});
        const [selectedColumns, setSelectedColumns] = useState<number[]>([]);
        const [checkState, setCheckState] = useState(props.manage); // 控制多选框是否可用

        useEffect(() => {
            if (order.data) {
                const initialSelectedColumns = order.data
                    .map((item, index) => (item.isVisable ? index : -1))
                    .filter(index => index !== -1);
                setSelectedColumns(initialSelectedColumns);
            }
        }, [order.data]);

        useEffect(() => {
            setCheckState(props.manage);
        }, [props.manage]);

        const handleCheckboxChange = (index: number, checked: boolean) => {
            if (checked) {
                setSelectedColumns(prev => [...prev, index]);
            } else {
                setSelectedColumns(prev => prev.filter(item => item !== index));
            }
        };

        const changeVisable = api.order.changeStatus.useMutation({
            onSuccess: () => {
                message.success('保存成功');
                window.location.reload();
            },
        });

        const handleSave = () => {
            const selectedColumnIds = selectedColumns.map(index => order.data[index]?.columnId);
            order.data.forEach(item => {
                changeVisable.mutate({
                    columnId: item.columnId,
                    isVisable: selectedColumnIds.includes(item.columnId),
                    userId: token[0],
                });
            });
        };
        return (
            <div className="w-85.75 h-20.471 bg-#fff m-auto border-rd-2.5 flex">
                <div>
                    {column?.data?.length > 0 ? (
                        <div className={"flex w-100% flex-col mt-2"}>
                            {column.data?.map((item, index) => (
                                <Checkbox
                                    value={index}
                                    className={'flex flex-row'}
                                    key={item?.id}
                                    checked={selectedColumns.includes(index)}
                                    onChange={e => handleCheckboxChange(index, e.target.checked)}
                                    disabled={!checkState}
                                >
                                    <div className={"flex"}>
                                        <Image src={item ? item.logo : ''} width={100} height={100}
                                               alt={"cover"}
                                               className="w-11.375 h-15.478 rounded inline-block"></Image>
                                        <span className="ml-3 mt-3 flex flex-col">
                                            <h3 className="text-[#252525] text-3 font-500 lh-6">{item?.name ? (item?.name?.length >= 20 ? item?.name?.substring(0, 20) + "..." : item?.name) : "无数据"}</h3>
                                            <h4 className="text-[#666] text-2.5 lh-[120%] mt-1">{item?.introduce ? (item?.introduce?.length >= 50 ? item?.introduce?.substring(0, 50) + "..." : item?.introduce) : "无数据"}</h4>
                                        </span>
                                    </div>
                                </Checkbox>
                            ))}
                        </div>
                    ) : (
                        <div className="ml-31.5 text-[#B5B5B5] mt-20">暂无数据哦~</div>
                    )}
                </div>
            </div>
        )
    }
);


export default ManagementColumn;
