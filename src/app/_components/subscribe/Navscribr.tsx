// const Navscribe = () => {
//     return (
//         <div>更新 专栏 小课</div>
//     )
// }
"use client";
'use strict'
import React from 'react';
import SubscribeColumn from './SubscribeColumn';
import SubscribeRenew from './SubscribeRenew';


// export default function Navscribr({ children }: { children: React.ReactNode }) {


// }


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
        return <SubscribeColumn />;
    };
    const Page3 = () => {
        const [c, setC] = React.useState<undefined>(undefined);
        return <div>3</div>;
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
            <div className='flex'>
                <div onClick={() => setCurrentPage(1)}>更新</div>
                <div onClick={() => setCurrentPage(2)} >专栏</div>
                <div onClick={() => setCurrentPage(3)}>小课</div>
            </div>
            {renderContent()}
        </div>
    );
};

export default Page;



