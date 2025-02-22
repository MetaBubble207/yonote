"use client";
import React from "react";
import "./writer.css";
import Compass from "@/app/_components/writer/Compass";
import LeftCompass from "@/app/_components/writer/LeftCompass";
import withTheme from "@/theme";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const filteredPath = ["/writer/login", "/writer/no-column"];
  return (
    <div className="min-h-screen w-full bg-[#F6F6F6]">
      <Compass></Compass>
      <div className="w-100% flex">
        <LeftCompass></LeftCompass>
        {withTheme(
          <div
            className={`relative w-full ${
              !filteredPath.includes(pathname)
                ? "min-h-235 pl-69.12 pt-21.5 pb-4 pr-8"
                : "h-100vh"
            }`}
          >
            <div>
              {children}
              <div
                className={
                  "z-1 left-50% text-gray text-3 absolute bottom-5 flex items-center justify-center bg-transparent"
                }
              >
                ICP备案号：
                <Link href={"http://beian.miit.gov.cn/ "}>
                  {" "}
                  京ICP备2024064381号-1
                </Link>
              </div>
            </div>
          </div>,
        )}
      </div>
    </div>
  );
};

export default Layout;
