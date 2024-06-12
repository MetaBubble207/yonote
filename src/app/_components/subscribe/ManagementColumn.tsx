"use client"
import Image from "next/image"
import {Checkbox, message} from 'antd';
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import useLocalStorage from "@/tools/useStore";
import {api} from "@/trpc/react";

// eslint-disable-next-line react/display-name
const ManagementColumn = forwardRef(
    (props, ref) => {
        useImperativeHandle(
            ref,
            () => ({ handleSave })
        );
    // const {manage} = props;
    const token = useLocalStorage("token", '');
    const order = api.order.getUserOrder.useQuery({
        userId: token[0],
    });
    const column = api.column.getOrderColumn.useQuery({userId: token[0]});
    console.log(column)
    const [array, setArray] = useState([]);
    const [checkSate, setCheckSate] = useState(props.manage); // 控制多选框是否可用
    const outputValue = (checkedValues) => {
        console.log('checked values:', checkedValues);
        setArray(checkedValues);
    };

    const isVisable = api.column.getOrderColumn.useQuery({
        userId: token[0]
    }).data

    console.log(isVisable)

    useEffect(() => {
        console.log('selectedOptions:', array);
    }, [array])

    useEffect(() => {
        if (props.manage === false) {
            setCheckSate(false);
        } else {
            setCheckSate(true);
        }
    })
    console.log(column.data?.length);

    const changeVisable = api.column.changeStatus.useMutation({
        onSuccess: (r) => {
            console.log(r);
        },
    });
    const handleSave = () => {
        const selectedColumnIds = array.map((index) => column.data[index].id);

        column.data.forEach((item) => {
            if (selectedColumnIds.includes(item.id)) {
                changeVisable.mutate({
                    id: item.id,
                    isVisable: true,
                    userId: token[0],
                });
            } else {
                changeVisable.mutate({
                    id: item.id,
                    isVisable: false,
                    userId: token[0],
                });
            }
        });

        console.log("选中的column的id:", selectedColumnIds);
        message.success('保存成功');
    }

    return (
        <div className="w-85.75 h-20.471 bg-#fff m-auto border-rd-2.5 flex">
            <div>
                <div className={"flex w-100%"}>
                    <Checkbox.Group onChange={outputValue} disabled={!checkSate} className={"flex-col flex"}>
                        {column.data && column.data.map((item, index) => (
                            <Checkbox value={index} className={'mb-2 flex flex-row'} key={item?.id}>
                                <div className={"flex"}>
                                    <Image src={item ? item.logo : ''} width={100} height={100}
                                           alt={"cover"} className="w-11.375 h-15.478 rounded inline-block"></Image>
                                    <span className="ml-3 mt-3 flex flex-col">
                                        <h3 className="text-[#252525] text-3 font-500 lh-6">{item?.name ? item?.name : "无数据"}</h3>
                                        <h4 className="text-[#666] text-2.5 lh-[120%] mt-1">{item?.introduce ? item?.introduce : "无数据"}</h4>
                                    </span>
                                </div>
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </div>
            </div>
        </div>
    )

}
);

export default ManagementColumn;
