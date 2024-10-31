"use client"
import React from "react";
import "./writer.css";
import Compass from "@/app/_components/writer/Compass";
import LeftCompass from "@/app/_components/writer/LeftCompass";
import withTheme from "@/theme";
import {usePathname} from "next/navigation";

const Layout = ({children}: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const filteredPath = ["/writer/login", "/writer/no-column"];
    return (
        <div className="w-full min-h-screen bg-[#F6F6F6]">
            <Compass></Compass>
            <div className="flex w-100%">
                <LeftCompass></LeftCompass>
                {withTheme(<div
                    className={`w-full 
                        ${!filteredPath.includes(pathname)
                        ? 'min-h-230 pl-69.12 pt-21.5 pb-4 pr-8'
                        : 'h-100vh'}`}>{children}</div>)}

            </div>
        </div>
    );
};

export default Layout;
