'use client'
import React from 'react';
import {ConfigProvider, Pagination} from 'antd';

import zhCN from 'antd/es/locale/zh_CN';

const MyPagination = () => (
    <ConfigProvider locale={zhCN} theme={{
        components: {
            Pagination: {
                itemActiveBg:'#DAF9F1',
                colorPrimary:'#1DB48D',
                colorPrimaryHover:'#1DB48D',
                colorText:'rgba(0, 0, 0, 0.65)',
            }
        }
    }}>

        <Pagination
            total={85}
            showSizeChanger
            showQuickJumper
        />
    </ConfigProvider>
);

export default MyPagination;