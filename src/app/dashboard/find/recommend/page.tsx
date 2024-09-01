"use client"
import React, {useState} from "react";
import SpecialColumn from "@/app/_components/dashboard/recommend/SpecialColumn";
import YonoteCourse from "@/app/_components/dashboard/recommend/YonoteCourse";
import CoCreate from "@/app/_components/dashboard/recommend/CoCreate";
import {Button} from "antd";
import withTheme from "@/theme";

const Recommend = function () {
    const [currentContent, setCurrentContent] = useState<number>(1);

    const renderContent = () => {
        switch (currentContent) {
            case 1:
                return <SpecialColumn/>;
            case 2:
                return <YonoteCourse/>;
            case 3:
                return <CoCreate/>;

        }
    }
    return <div className="min-h-screen bg-#F5F7FB pt-8 w-full">
        <div className={"flex items-center w-full h-6 pl-4"}>
            <div>
                <Button type={'link'} size={'small'} onClick={() => setCurrentContent(1)}
                        className={`flex w-14 h-6 text-3.5 lh-6`}>专栏推荐
                </Button>
                {currentContent === 1 && (
                    <div className="ml-6 w-2.75 h-1 shrink-0 border-rd-2 bg-[#45E1B8]"></div>
                )}
            </div>

            <div>
                <Button type={'link'} size={'small'} onClick={() => setCurrentContent(2)}
                        className={`flex ml-10 w-14 h-6 text-3.5 lh-6`}>有记小课
                </Button>
                {currentContent === 2 && (
                    <div className="ml-16 w-2.75 h-1 shrink-0 border-rd-2 bg-[#45E1B8]"></div>
                )}
            </div>

            <div>
                <Button type={'link'} size={'small'} onClick={() => setCurrentContent(3)}
                        className={`flex ml-10 w-14 h-6 text-3.5 lh-6 `}>共创计划
                </Button>
                {currentContent === 3 && (
                    <div className="ml-16 w-2.75 h-1 shrink-0 border-rd-2 bg-[#45E1B8]"></div>
                )}
            </div>
        </div>
        {renderContent()}
    </div>;
}

const Page = () => {
    return withTheme(<Recommend/>)
}
export default Page;
