import React from "react";
import "../writer.css";
import Compass from "@/app/_components/writer/Compass";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-[#F6F6F6]">
      <Compass></Compass>
      <div className={`w-full h-full flex flex-col flex-1`}>
        <div className="flex-1">{children}</div>
        <div className={"text-gray text-3 flex items-center justify-center bg-transparent mt-8"}>
          ICP备案号：
          <Link href={"http://beian.miit.gov.cn/ "}>
            京ICP备2024064381号-1
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Layout;
