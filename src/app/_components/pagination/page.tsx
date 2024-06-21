'use client'
import React from 'react';
import { ConfigProvider, Pagination } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

interface MyPaginationProps {
    total: number;
    pageSize: number;
    current: number;
    onChange: (page: number, pageSize?: number) => void;
}

const MyPagination: React.FC<MyPaginationProps> = ({ total, pageSize, current, onChange }) => (
    <ConfigProvider locale={zhCN} theme={{
        components: {
            Pagination: {
                itemActiveBg: '#DAF9F1',
                colorPrimary: '#1DB48D',
                colorPrimaryHover: '#1DB48D',
                colorText: 'rgba(0, 0, 0, 0.65)',
            }
        }
    }}>
        <Pagination
            total={total}
            pageSize={pageSize}
            current={current}
            showSizeChanger
            showQuickJumper
            onChange={onChange}
        />
    </ConfigProvider>
);

export default MyPagination;
