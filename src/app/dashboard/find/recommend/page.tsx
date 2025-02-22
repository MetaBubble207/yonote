"use client";
import React, { useState } from "react";
import SpecialColumn from "@/app/_components/dashboard/recommend/SpecialColumn";
import YonoteCourse from "@/app/_components/dashboard/recommend/YonoteCourse";
import CoCreate from "@/app/_components/dashboard/recommend/CoCreate";
import { Button } from "antd";
import withTheme from "@/theme";

const Recommend = function () {
  const [currentContent, setCurrentContent] = useState<number>(1);

  const renderContent = () => {
    switch (currentContent) {
      case 1:
        return <SpecialColumn />;
      case 2:
        return <YonoteCourse />;
      case 3:
        return <CoCreate />;
    }
  };
  return (
    <div className="bg-#F5F7FB min-h-screen w-full pt-8">
      <div className={"flex h-6 w-full items-center pl-4"}>
        <div>
          <Button
            type={"link"}
            size={"small"}
            onClick={() => setCurrentContent(1)}
            className={`text-3.5 lh-6 flex h-6 w-14`}
          >
            专栏推荐
          </Button>
          {currentContent === 1 && (
            <div className="w-2.75 border-rd-2 ml-6 h-1 shrink-0 bg-[#45E1B8]"></div>
          )}
        </div>

        <div>
          <Button
            type={"link"}
            size={"small"}
            onClick={() => setCurrentContent(2)}
            className={`text-3.5 lh-6 ml-10 flex h-6 w-14`}
          >
            有记小课
          </Button>
          {currentContent === 2 && (
            <div className="w-2.75 border-rd-2 ml-16 h-1 shrink-0 bg-[#45E1B8]"></div>
          )}
        </div>

        <div>
          <Button
            type={"link"}
            size={"small"}
            onClick={() => setCurrentContent(3)}
            className={`text-3.5 lh-6 ml-10 flex h-6 w-14`}
          >
            共创计划
          </Button>
          {currentContent === 3 && (
            <div className="w-2.75 border-rd-2 ml-16 h-1 shrink-0 bg-[#45E1B8]"></div>
          )}
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

const Page = () => {
  return withTheme(<Recommend />);
};
export default Page;
