"use client"
import Image from "next/image"
import {Checkbox, message} from 'antd';
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import useLocalStorage from "@/tools/useStore";
import {api} from "@/trpc/react";
import Loading from "@/app/_components/common/Loading";

const ManagementColumn = forwardRef(
    (props: any, ref) => {
        useImperativeHandle(
            ref,
            () => ({handleSave})
        );
        const [token] = useLocalStorage("token", '');
        const {data: columns, isLoading} =
            api.column.getAlreadySubscribedColumns.useQuery({userId: token});
        const [columnsState, setColumnsState] = useState(columns);

        const [checkState, setCheckState] = useState(props.manage); // 控制多选框是否可用

        useEffect(() => {
            setCheckState(props.manage);
        }, [props.manage]);
        useEffect(()=>{
            setColumnsState(columns);
        },[columns])
        const changeVisible = api.order.changeStatus.useMutation();

        const handleSave = () => {
            columnsState.forEach(item => {
                changeVisible.mutate({
                    columnId: item.column.id,
                    isVisible: item.order.isVisible,
                    userId: token,
                });
            });
            message.success('保存成功');
        };

        const handleChange = (index: number, visible: boolean) => {
            const newColumns = columnsState.map((item, i) => {
                if (index === i) {
                    item.order.isVisible = visible
                }
                return item;
            })
            setColumnsState(newColumns)
        }
        if (isLoading) return <Loading/>
        return (
            <div className="w-85.75 h-20.471 bg-#fff m-auto border-rd-2.5 flex">
                <div className={"flex w-100% flex-col mt-2"}>
                    {columnsState?.map(({column, order}, index) => (
                        <Checkbox
                            value={index}
                            className={'flex flex-row'}
                            key={column.id}
                            checked={order.isVisible}
                            onChange={e => handleChange(index, e.target.checked)}
                            disabled={!checkState}
                        >
                            <div className={"flex"}>
                                <Image src={column.cover} width={100} height={100}
                                       alt={"cover"}
                                       className="w-11.375 h-15.478 rounded inline-block"></Image>
                                <span className="ml-3 mt-3 flex flex-col">
                                            <div
                                                className="text-[#252525] text-3 font-500 lh-6">{(column.name?.length >= 20 ? column.name?.substring(0, 20) + "..." : column.name)}</div>
                                            <div className="text-[#666] text-2.5 lh-[120%] mt-1">
                                                {column.introduce ? (column.introduce?.length >= 50
                                                    ? column.introduce?.substring(0, 50) + "..."
                                                    : column.introduce) : "该专栏还没有设置简介"}
                                            </div>
                                        </span>
                            </div>
                        </Checkbox>
                    ))}
                </div>
            </div>
        )
    }
);


export default ManagementColumn;
