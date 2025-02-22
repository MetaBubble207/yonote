"use client"
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { message } from 'antd';
import debounce from 'lodash/debounce';

const SearchColumn = ({ defaultValue }: { defaultValue: string }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const pathname = usePathname();
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState(defaultValue);
    const router = useRouter();

    // 使用 useEffect 处理初始化和焦点
    useEffect(() => {
        setSearchValue(defaultValue);

        if (pathname?.includes("/search-result") && inputRef.current) {
            inputRef.current.focus();
        }
    }, [defaultValue, pathname]);

    // 使用 useCallback 优化函数
    const handleSearch = useCallback(() => {
        const trimmedValue = searchValue.trim();
        if (!trimmedValue) {
            messageApi.info("请输入内容再进行搜索😯~");
            return;
        }
        router.push(`/dashboard/find/search-result?query=${encodeURIComponent(trimmedValue)}`);
    }, [searchValue, router, messageApi]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    // 使用 debounce 优化输入性能
    const debouncedSetSearchValue = useCallback(
        debounce((value: string) => setSearchValue(value), 300),
        []
    );

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetSearchValue(e.target.value);
    }, [debouncedSetSearchValue]);

    return (
        <div className="w-full inline rounded-13 h-8.5 bg-[#FFF] flex items-center pr-5">
            {contextHolder}
            <div className="flex items-center cursor-pointer" onClick={handleSearch}>
                <Image
                    src="/images/subscribe/search.png"
                    alt="search"
                    width={18}
                    height={18}
                    className="inline ml-5.25 w-4.5 h-4.5"
                />
            </div>
            <input
                ref={inputRef}
                type="search"
                defaultValue={defaultValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="仅支持搜索专栏和作者"
                className="text-3.25 text-[#999] leading-8.5 ml-1.6 justify-center outline-none w-full h-8.5 pl-1.6 rounded-13"
            />
        </div>
    );
};

export default React.memo(SearchColumn);
