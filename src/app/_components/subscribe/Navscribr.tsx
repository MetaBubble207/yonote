"use client";
import SubscribeColumn from './SubscribeColumn';
import SubscribeRenew from './SubscribeRenew';
import SubscribeManage from './SubscribeManage';
import React, {Suspense, useState, useContext} from "react"
import {api} from "@/trpc/react";
import useLocalStorage from '@/tools/useStore';
import SubscribeClass from '../special-column/SubscribeClass';
import Loading from '../common/Loading';


const Page = () => {
    const token = useLocalStorage('token', '')
    // const {data:columns, isFetched} = api.column.getAll.useQuery();
    const columns = api.column.getAll.useQuery().data;
    // const orders = api.order.getUserOrder.useQuery({
    //     userId: token[0],
    // }).data;
    const {data:orders,isFetched} = api.order.getUserOrder.useQuery({
        userId: token[0],
    });
    
    // 按钮选中状态
    const [selectedButton, setSelectedButton] = useState<number | null>(1); // 追踪选中的按钮

    const handleButtonClick = (button: number) => {
        if (selectedButton !== button) {
            // 如果点击的是当前选中的按钮，则取消选中状态
            setSelectedButton(button);
        }
    };
    
    // 导航栏返回相应页面
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    
    const Update = () => {
        return (
            <div>
                {/* {isFetched?<div><Loading></Loading></div>: */}
                {orders && orders.length > 0 && (
                    <div>
                        {columns && columns.length > 0 && columns.map((column: any) => (
                            // 检查当前 column 是否在 orders 中存在
                            orders.some(order => order.columnId === column.id) && column.isVisable && (
                                <SubscribeRenew key={column.id} column={column} />
                            )
                        ))}
                    </div>
                )}
                
            </div>
        );
    };

    const Column = () => {
        return (
            <div>
                {orders && orders.length > 0 && (
                    <div>
                        {columns && columns.length > 0 && columns.map((column: any) => (
                            // 检查当前 column 是否在 orders 中存在
                            orders.some(order => order.columnId === column.id) && (
                                <SubscribeColumn key={column.id} column={column} />
                            )
                        ))}
                    </div>
                )}
                {/* {columns && columns.length > 0 && columns.map((column: any) => (
                    <SubscribeColumn key={column.id} column={column} />
                ))} */}
            </div>

        )
    };

    const Course = () => {
        return (
            <div>
                {orders && orders.length > 0 && (
                    <div>
                        {columns && columns.length > 0 && columns.map((column: any) => (
                            // 检查当前 column 是否在 orders 中存在
                            orders.some(order => order.columnId === column.id) && (
                                <SubscribeClass key={column.id} column={column} />
                            )
                        ))}
                    </div>
                )}
                {/* {columns && columns.length > 0 && columns.map((column: any) => (
                    <SubscribeColumn key={column.id} column={column} />
                ))} */}
            </div>
        );
    }

    const renderContent = (): React.ReactNode => {
        if(!isFetched){
            return <div className='flex items-center justify-center h-[400px]'><Loading></Loading> </div>         
        }
        switch (currentPage) {
            case 1:
                return <Update/>;
            case 2:
                return <Column/>;
            case 3:
                return <Course/>;
        }
    };

    // 订阅管理栏事件，点击弹出弹窗
    // const [showModal, setShowModal] = React.useState(false);
    // const handleModal = (): React.ReactNode => {
    //     setShowModal(true);
    //     return (
    //         // <SubscribeManage></SubscribeManage>
    //         <div>32323232323</div>
    //     )
    // }
    const buttonData = [
        { id: 1, label: '更新' },
        { id: 2, label: '专栏' },
        { id: 3, label: '小课' },
    ];

    const renderButtons = () => {
        return buttonData.map((button) => (
            <button
                key={button.id}
                onClick={() => setCurrentPage(button.id)}
                onClickCapture={() => handleButtonClick(button.id)}
                className={`${selectedButton === button.id ? 'text-[#252525] fw-500' : 'text-[#B5B5B5] fw-400'} font-sans w-43 justify-between`}
            >
                {button.label}
                <div className={`w-2.75 h-1 m-auto border-rd-2 bg-[#45E1B8] ${selectedButton === button.id ? 'bg-#45E1B8' : 'bg-#f5f7fb'}`}></div>
            </button>
        ));
    };

    return (
        <div> 
            <div className='mt-6 mb-3 flex justify-between items-center '>
                <div className='flex w-43 justify-between'>
                    {renderButtons()}
                </div>
                <SubscribeManage></SubscribeManage>
            </div>
            {renderContent()}
        </div>
    );
};

export default Page;



