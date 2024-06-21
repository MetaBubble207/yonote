'use client';
import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import UserSubscriptions from '@/app/_components/writer/UserSubscriptions';
import MyPagination from '@/app/_components/pagination/page';

const Page = () => {
    const params = useSearchParams();
    const columnId = params.get("columnId");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5); // 设置初始 pageSize 为 1
    const [total, setTotal] = useState<number>(0);

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) setPageSize(pageSize);
    };

    return (
        <Suspense>
            <div className='w-full h-full'>
                <div className='w-97% min-h-150 relative ml-4.465 mt-4.02 pt-8 pl-8 shrink-0 rounded-tl-lg rounded-tr-lg bg-[#FFF]'>
                    <h3 className='text-[#323232] text-4 font-700 lh-6'>订阅管理</h3>
                    <UserSubscriptions
                        columnId={columnId}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        setTotal={setTotal}
                    />
                    <div className="absolute bottom-10 left-60 flex justify-center items-center">
                        <MyPagination
                            total={total}
                            pageSize={pageSize}
                            current={currentPage}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default Page;
