"use client";
'use strict';
import React from 'react';
import SubscribeColumn from './SubscribeColumn';
import SubscribeRenew from './SubscribeRenew';
import Image from 'next/image';


const Page = () => {
    const [currentPage, setCurrentPage] = React.useState<number>(1);

    const Page1 = () => {
        const [c, setC] = React.useState<undefined>(undefined);
        return (
            <div>
                <SubscribeRenew />
                <SubscribeRenew />
            </div>)
    };
    const Page2 = () => {
        const [c, setC] = React.useState<undefined>(undefined);
        return (
            <div>
                <SubscribeColumn />
                <SubscribeColumn />
            </div>

        )
    };
    const Page3 = () => {
        const [c, setC] = React.useState<undefined>(undefined);
        return (
            <div>
                <SubscribeColumn />
                <SubscribeColumn />
                <SubscribeColumn />
            </div>
        );
    }
    const renderContent = (): React.ReactNode => {
        switch (currentPage) {
            case 1:
                return <Page1 />;
            case 2:
                return <Page2 />;
            case 3:
                return <Page3 />;
        }
    };

    return (
        <div>
            <div className='mt-6 mb-3 flex justify-between items-center'>
                <div className='flex w-43 justify-between'>
                    <div onClick={() => setCurrentPage(1)} className=''>更新</div>
                    <div onClick={() => setCurrentPage(2)} className=''>专栏</div>
                    <div onClick={() => setCurrentPage(3)} className=''>小课</div>
                </div>
                <div className='text-[#B5B5B5] text-2.5 lh-6 flex items-center'>
                    <div className='mr-1'>订阅管理</div>
                    <Image src={"/images/subscribe/manage.svg"} width={12} height={12} alt="manage" className='w-3 h-3'></Image>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default Page;



