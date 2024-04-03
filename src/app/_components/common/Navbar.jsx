"use client"
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className='flex justify-center'>
            <div className='flex flex-row justify-center w-61.25 h-13 text-center text-2.5 bg-[#FFF] border-rd-13 shadow-[0px_1px_4px_2px_rgba(0,0,0,0.05)] overflow-hidden'>
                <Link href="find" className='flex-1 text-[#b5b5b5] font-500 mt-1 '>
                    <img src={"/images/nav/find.svg"} alt={"find"} className='m-auto w-6 h-6'></img>
                    <div className='lh-5.5'>发现</div>
                </Link>
                <Link href="subscribe" className='flex-1 text-[#b5b5b5] font-500 mt-1'>
                    <img src={"/images/nav/book.svg"} alt={"subscribe"} className='m-auto w-6 h-6'></img>
                    <div className='lh-5.5'>订阅</div>
                </Link>
                <Link href="user" className='flex-1 text-[#b5b5b5] font-500 mt-1 '>
                    <img src={"/images/nav/user.svg"} alt={"use"} className='m-auto w-6 h-6'></img>
                    <div className='lh-5.5'>我的</div>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;