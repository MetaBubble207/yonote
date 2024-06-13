"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "../../../_components/common/Navbar";
import Activities from "@/app/_components/find/activities";
import { SearchColumn } from "@/app/_components/common/SearchColumn";

const Page = () => {

    return (
        <div className="min-h-screen relative bg-#F5F7FB">
            <div className="w-85.75 m-auto pt-8">
                {/* 搜索框 */}
                <SearchColumn />
            </div>
            <div className="bottom-4 justify-center w-full fixed">
                <Navbar />
            </div>
        </div>
    );
};

export default Page;
