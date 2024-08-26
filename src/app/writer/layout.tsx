import React from "react";
import "./writer.css";
import Compass from "@/app/_components/writer/Compass";
import LeftCompass from "@/app/_components/writer/LeftCompass";
import useLocalStorage from "@/tools/useStore";

const dialogLayout = ({children}: { children: React.ReactNode }) => {
    if (typeof window !== 'undefined') {
        const [token] = useLocalStorage("token", null);
        if (!token) {
            window.location.href = "/writer/login"
        }

    }
    return (
        <html>
        {/* <Script src="http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js" /> */}
        <body>
        <div className="w-100% min-h-screen bg-[#F6F6F6]">
            <Compass></Compass>
            <div className="flex w-100%">
                <LeftCompass></LeftCompass>
                <div className="w-100%  pl-64.77925 pt-17.5 pb-10">{children}</div>
            </div>
        </div>
        </body>
        </html>
    );
};

export default dialogLayout;
