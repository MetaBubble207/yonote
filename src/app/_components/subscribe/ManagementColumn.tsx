"use client"
import Image from "next/image"
import {Checkbox} from 'antd';
import {useEffect, useState} from "react";
import useLocalStorage from "@/tools/useStore";
import {api} from "@/trpc/react";


const ManagementColumn = (props) => {

    const token = useLocalStorage("token", '');
    const order = api.order.getUserOrder.useQuery({
        userId: token[0],
    });
    const column = api.column.getOrderColumn.useQuery({userId: token[0]});
    const [array, setArray] = useState([]);
    const [checkSate, setCheckSate] = useState(props.manage); // 控制多选框是否可用

    const outputValue = (checkedValues) => {
        console.log('checked values:', checkedValues);
        setArray(checkedValues);
    };

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
    return (
        <div className="w-85.75 h-20.471 bg-#fff m-auto border-rd-2.5 flex">
            <div>
                <div className={"flex flex-col"}>
                    <Checkbox.Group onChange={outputValue} disabled={!checkSate}>
                        <Checkbox value={1}>
                            <div className={"flex"}>
                                <Image src={column.data ? column.data[0].logo : ''} width={100} height={100}
                                       alt={"cover"} className="w-11.375 h-15.478"></Image>
                                <div className="ml-3 mt-3 flex-1">
                                    <h3 className="text-[#252525] text-3 font-500 lh-6">{column.data?.map((column) => column.name)}</h3>
                                    <h4 className="text-[#666] text-2.5 lh-[120%] mt-1">{column.data?.map((column) => column.introduce)}</h4>
                                </div>
                            </div>
                        </Checkbox>
                    </Checkbox.Group>
                </div>
            </div>
        </div>
    )

}

export default ManagementColumn;
