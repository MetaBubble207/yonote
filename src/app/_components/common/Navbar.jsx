"use client"
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className='flex justify-center'>
            <div className='flex flex-row justify-center w-65% h-20.8 text-center text-4 bg-[#FFF] border-rd-13 shadow-[0px_1px_4px_2px_rgba(0,0,0,0.05)] overflow-hidden'>
                <Link href="find" className='flex-1 text-[#b5b5b5] font-500 mt-1.2'>
                    <img src={"/images/nav/find.svg"} alt={"find"} className='m-auto mb-1.2 w-9.6 h-9.6'></img>
                    发现
                </Link>
                <Link href="subscribe" className='flex-1 text-[#b5b5b5] font-500 mt-1.2'>
                    <img src={"/images/nav/book.svg"} alt={"subscribe"} className='m-auto mb-1.2 w-9.6 h-9.6'></img>
                    订阅
                </Link>
                <Link href="user" className='flex-1 text-[#b5b5b5] font-500 mt-1.2'>
                    <img src={"/images/nav/user.svg"} alt={"use"} className='m-auto mb-1.2 w-9.6 h-9.6'></img>
                    我的
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;