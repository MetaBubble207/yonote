"use client";
import SubscribeColumn from './SubscribeColumn';
import SubscribeRenew from './SubscribeRenew';
import SubscribeManage from './SubscribeManage';
import React, {useState} from "react"
import {api} from "@/trpc/react";
import useLocalStorage from '@/tools/useStore';
import {Button, Skeleton} from "antd";
import NoData from "@/app/_components/common/NoData";
import Loading from "@/app/_components/common/Loading";

const SubscribeMain = () => {
    const [token] = useLocalStorage('token', null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    return (
        <>
            <div className='flex justify-between items-center'>
                <Tabs/>
                <SubscribeManage/>
            </div>
            <div className={"mt-3.5"}>
                <List/>
            </div>
        </>
    );

    function Tabs() {
        const buttonData = [
            {id: 1, label: '更新'},
            {id: 2, label: '专栏'},
            {id: 3, label: '小课'},
        ];
        return <div className='flex space-x-8 text-4.5'>
            {buttonData.map((button) => (
                <Button
                    size={'small'}
                    type={'link'}
                    key={button.id}
                    onClick={() => setCurrentPage(button.id)}
                    className={`p0 ${currentPage === button.id ? 'text-[#252525] fw-500' : 'text-[#B5B5B5] fw-400'}`}
                >
                    {button.label}
                    <div
                        className={`w-2.75 h-1 m-auto rounded-2
                                ${currentPage === button.id ? 'bg-#45E1B8' : ''}`}/>
                </Button>
            ))
            }
        </div>
    }

    function Update() {
        const {
            data: updateColumnData,
            isLoading: isUpdateColumnLoading
        } = api.column.getUpdateColumn.useQuery({userId: token});
        console.log(updateColumnData);
        if (isUpdateColumnLoading) return <>
            <Skeleton
                active
                paragraph={{rows: 5}}
                title={false}
                className="w-85.75 h-42.75 border-rd-5 bg-[#FFF] mb-2 p4"
            />
            <Skeleton
                active
                paragraph={{rows: 5}}
                title={false}
                className="w-85.75 h-42.75 border-rd-5 bg-[#FFF] mb-2 p4"
            />
            <Skeleton
                active
                paragraph={{rows: 5}}
                title={false}
                className="w-85.75 h-42.75 border-rd-5 bg-[#FFF] mb-2 p4"
            />
        </>

        if (!updateColumnData || updateColumnData.length < 1) return <NoData title={'你订阅的所有专栏都暂未更新噢😁~'}/>

        return <div>
            {updateColumnData.map((column: any) => (
                <SubscribeRenew key={column.id} column={column}/>
            ))}
        </div>
    }

    function Column() {
        const {
            data: visibleColumnData,
            isLoading: isViableColumnLoading
        } = api.column.getVisibleColumn.useQuery({userId: token});
        if (isViableColumnLoading) return <Loading/>
        if (!visibleColumnData || visibleColumnData.length < 1) return <NoData title={'还没有订阅过专栏噢😯~'}/>
        return (
            <div>
                {visibleColumnData.map((column: any) => (
                    <SubscribeColumn key={column.id} column={column}/>
                ))}
            </div>
        );
    }

    function Course() {
        return <NoData title={'还没有购买过小课噢😯~'}/>
    }

    function List() {
        switch (currentPage) {
            case 1:
                return <Update/>;
            case 2:
                return <Column/>;
            case 3:
                return <Course/>;
        }
    }
};

export default SubscribeMain;
