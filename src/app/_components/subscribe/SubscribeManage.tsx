import React, {useRef, useState} from 'react';
import ManagementColumn from './ManagementColumn';
import ManagementClass from './ManagementClass';
import Image from 'next/image';
import {Button, Drawer} from "antd";

const SubscribeManage = () => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const Panel = () => {
        const saveColumn = useRef(null)
        const [manage, setManage] = useState(false);

        const handleManage = () => {
            if (saveColumn.current && manage == true) {
                saveColumn.current.handleSave();
                setOpen(false);
                window.location.reload();
            }
            setManage(!manage);
        }

        const [selectedButton, setSelectedButton] = useState(1); // 追踪选中的按钮
        const handleButtonClick = (button: number) => {
            if (selectedButton !== button) {
                // 如果点击的是当前选中的按钮，则取消选中状态
                setSelectedButton(button);
            }
        };
        return <Drawer
            placement={'bottom'}
            closable={true}
            onClose={onClose}
            open={open}
            key={'bottom'}
            height={494}
            style={{borderRadius: '20px'}}
        >
            <h2 className='text-[#252525] text-3.5 font-500 lh-6'>订阅管理</h2>
            <div className='flex justify-between mt-9 mr-4 mb-4.5'>
                <div className='font-400 lh-6 flex justify-center'>
                    <button
                        className={`w-17 h-6 rounded-4px ${selectedButton === 1 ? 'bg-[rgba(69,225,184,0.20)] text-[#1DB48D]' : 'color-#999999 bg-#F5F7FB'}`}
                        onClick={() => handleButtonClick(1)}>专栏
                    </button>
                    <button
                        className={`w-17 h-6 ml-6 rounded-4px ${selectedButton === 2 ? ' bg-[rgba(69,225,184,0.20)] text-[#1DB48D]' : 'color-#999999 bg-#F5F7FB'}`}
                        onClick={() => handleButtonClick(2)}>小课
                    </button>
                </div>
                <Button type={'link'} size={'small'} onClick={handleManage}
                        className='text-[#1DB48D] font-400 lh-6'>{manage ? '保存' : '管理'}</Button>
            </div>
            {selectedButton === 1
                && (<ManagementColumn manage={manage} ref={saveColumn}/>)
            }
            {selectedButton === 2
                && (<ManagementClass manage={manage}/>)}
        </Drawer>
    }
    return (
        <div>
            <div className={"flex items-center"}>
                <Image src={"/images/subscribe/manage.svg"} width={12} height={12} alt="manage" className={'pt-0.5'}/>
                <Button type={'link'} size={'small'} onClick={showDrawer}
                        className='text-[#B5B5B5] text-2.5 lh-6 ml-0.5'>订阅管理</Button>
            </div>
            <Panel/>
        </div>
    );
};

export default SubscribeManage;