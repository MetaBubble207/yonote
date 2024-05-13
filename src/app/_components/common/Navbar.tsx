"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();
    const [column, setColumn] = useState(pathname === "/dashboard/find");
    useEffect(() => {
        setColumn(pathname === "/dashboard/find");
      }, [pathname]);
    return (
        <nav className='flex justify-center'>
            <div className='flex flex-row justify-center w-61.25 h-13 text-center text-2.5 bg-[#FFF] border-rd-13 shadow-[0px_1px_4px_2px_rgba(0,0,0,0.05)] overflow-hidden'>
                <Link href="find" className='flex-1 text-[#b5b5b5] font-500 mt-1' >
                    <img
                    src={`${
                        pathname === "/dashboard/find"
                          ? "/images/nav/find_active.svg"
                          : "/images/nav/find.svg"
                      }`}
                    alt={"find"} className='m-auto w-6 h-6'></img>
                    <div className='lh-5.5'>发现</div>
                </Link>
                <Link href="subscribe" className='flex-1 text-[#b5b5b5] font-500 mt-1'>
                    <img
                    src={`${
                        pathname === "/dashboard/subscribe"
                          ? "/images/nav/subscribe_active.svg"
                          : "/images/nav/subscribe.svg"
                      }`}
                    alt={"subscribe"} className='m-auto w-6 h-6'></img>
                    <div className='lh-5.5'>订阅</div>
                </Link>
                <Link href="user" className='flex-1 text-[#b5b5b5] font-500 mt-1 '>
                    <img
                    src={`${
                        pathname === "/dashboard/user"
                          ? "/images/nav/user_active.svg"
                          : "/images/nav/user.svg"
                      }`}
                    alt={"user"} className='m-auto w-6 h-6'></img>
                    <div className='lh-5.5'>我的</div>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
