"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="flex justify-center">
      <div className="w-61.25 h-13 text-2.5 border-rd-13 flex flex-row justify-center overflow-hidden bg-[#FFF] bg-opacity-50 text-center shadow-[0px_1px_4px_2px_rgba(0,0,0,0.05)]">
        <Link
          href="/dashboard/find"
          className="font-500 mt-1 flex-1 text-[#b5b5b5]"
        >
          <img
            src={`${
              pathname === "/dashboard/find"
                ? "/images/nav/find_active.svg"
                : "/images/nav/find.svg"
            }`}
            alt={"find"}
            className="m-auto h-6 w-6"
          ></img>
          <div className="lh-5.5">发现</div>
        </Link>
        <Link
          href="/dashboard/subscribe"
          className="font-500 mt-1 flex-1 text-[#b5b5b5]"
        >
          <img
            src={`${
              pathname === "/dashboard/subscribe"
                ? "/images/nav/subscribe_active.svg"
                : "/images/nav/subscribe.svg"
            }`}
            alt={"subscribe"}
            className="m-auto h-6 w-6"
          ></img>
          <div className="lh-5.5">订阅</div>
        </Link>
        <Link
          href="/dashboard/user"
          className="font-500 mt-1 flex-1 text-[#b5b5b5]"
        >
          <img
            src={`${
              pathname === "/dashboard/user"
                ? "/images/nav/user_active.svg"
                : "/images/nav/user.svg"
            }`}
            alt={"user"}
            className="m-auto h-6 w-6"
          ></img>
          <div className="lh-5.5">我的</div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
