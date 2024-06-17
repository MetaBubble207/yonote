"use client"
import Image from "next/image";
import React, {useState, useEffect, useRef} from "react";
import {usePathname, useRouter} from "next/navigation";

export const SearchColumn = (props) => {
    const {SearchValue} = props
    const pathname = usePathname()
    const inputRef = useRef(null);
    useEffect(() => {
        if(pathname.includes("/search-page")){
            inputRef.current.focus()
        }
    }, []);
    const router = useRouter();
    const [searchValue, setSearchValue] = useState(SearchValue);
    const handleKeyDown =  (event) => {
        if (event.key === 'Enter') {
            setSearchValue(searchValue);
            router.push(`/dashboard/find/search-result?query=${searchValue}`);
        }

    };
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value)
    }
    return (
        <div className="w-full inline border-rd-13 h-8.5 bg-[#FFF] flex items-center">

            <Image src={"/images/subscribe/search.png"} alt="search" width={18} height={18} className="inline ml-5.25 w-4.5 h-4.5" />
            <input
                ref={inputRef}
                type="search"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="仅支持搜索专栏和作者"
                className="text-3.25 text-[#999] lh-8.5 ml-1.6 justify-center outline-none w-full h-8.5 pl-1.6 border-rd-13"
            />

        </div>
    );
};
