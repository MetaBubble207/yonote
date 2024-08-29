import React from "react";
import "./writer.css";
import Compass from "@/app/_components/writer/Compass";
import LeftCompass from "@/app/_components/writer/LeftCompass";
import useLocalStorage from "@/tools/useStore";

const Layout = ({children}: { children: React.ReactNode }) => {
    if (typeof window !== 'undefined') {
        const [token] = useLocalStorage("token", null);
        if (!token) {
            window.location.href = "/writer/login"
        }

    }
    return (
        <html>
        <body suppressHydrationWarning={true}>
        <div className="w-full min-h-screen bg-[#F6F6F6]">
            <Compass></Compass>
            <div className="flex w-100%">
                <LeftCompass></LeftCompass>
                <div className="w-full h-230 pl-69.12 pt-21.5 pb-4 pr-8">{children}</div>
            </div>
        </div>
        </body>
        </html>
    );
};

export default Layout;
