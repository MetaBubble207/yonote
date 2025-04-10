import React from "react";
import "../writer.css";
import Compass from "@/app/_components/writer/Compass";
import LeftCompass from "@/app/_components/writer/LeftCompass";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-[#F6F6F6] flex flex-col">
      <Compass />
      <div className="w-full flex ">
        <LeftCompass />
        <div className="w-full flex flex-col pl-70 pt-21.4 pr-4 min-h-screen">
          <div className="flex-1">{children}</div>
          <div className="text-gray text-3 flex items-center justify-center bg-transparent py-4">
            ICP备案号：
            <Link href="http://beian.miit.gov.cn/">京ICP备2024064381号-1</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Layout;