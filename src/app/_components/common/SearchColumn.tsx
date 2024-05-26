"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import {router} from "next/client";
import {useRouter} from "next/navigation";

export const SearchColumn = (props) => {
    const {SearchValue} = props
    const router = useRouter();

    const [searchValue, setSearchValue] = useState('');
    const [queryName, setQueryName] = useState(null);


    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            setQueryName(searchValue);
            router.push(`/dashboard/find/search-result?query=${searchValue}`);
        }

    };

    return (
        <div className="w-full inline border-rd-13 h-8.5 bg-[#FFF] flex items-center">

            <Image src={"/images/subscribe/search.png"} alt="search" width={18} height={18} className="inline ml-5.25 w-4.5 h-4.5" />
            <input
                type="search"
                value={SearchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="仅支持搜索专栏和作者"
                className="text-3.25 text-[#999] lh-8.5 ml-1.6 justify-center outline-none w-full h-8.5 pl-1.6 border-rd-13"
            />

        </div>
    );
};
