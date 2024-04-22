import React, { useState } from 'react';
import ManagementColumn from './ManagementColumn';
import Image from 'next/image';
const SubscribeManage = () => {
    const [showModal, setShowModal] = useState(false);

    const handleModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <button onClick={handleModal} className='text-[#B5B5B5] text-2.5 lh-6'>订阅管理</button>
            <Image src={"/images/subscribe/manage.svg"} width={12} height={12} alt="manage" className='w-3 h-3 inline-block justify-center ml-2 mt-1'></Image>
            {showModal && (
                <div className=" bg-[rgba(0,0,0,0.65)] h-100% fixed top-0 w-100% left-0 z-999" onClick={closeModal}>
                    <div className="" onClick={(e) => e.stopPropagation()}>
                        <div className="close" onClick={closeModal}>
                        </div>
                        <div className='fixed w-93.75 h-123.5 border-rd-[20px_20px_0px_0px] bg-[#FFF] bottom-0'>
                            <h2 className='text-[#252525] text-3.5 font-500 lh-6 mt-8 ml-4'>订阅管理</h2>
                            <div className='flex justify-between mt-6 ml-4 mr-4 mb-4'>
                                <div className='text-3.25 font-400 lh-6 flex justify-center'>
                                    <button className='w-15 h-6 border-rd-2 bg-#daf'>专栏</button>
                                    <button className='w-15 h-6 ml-6'>小课</button>
                                </div>
                                <button className='text-[#1DB48D] text-3.25 font-400 lh-6'>管理</button>
                            </div>
                            <ManagementColumn></ManagementColumn>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscribeManage;