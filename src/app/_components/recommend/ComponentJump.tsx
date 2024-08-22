"use client"
import {useState} from "react";
import {SpecialColumn} from "@/app/_components/recommend/SpecialColumn";
import {YonoteCourse} from "@/app/_components/recommend/YonoteCourse";
import {CoCreate} from "@/app/_components/recommend/CoCreate";
import {Button} from "antd";


export const ComponentJump = () => {
    const [currentContent, setCurrentContent] = useState<number>(1);
    const active = "text-black font-600";
    const inactive = "text-[#B5B5B5] font-500"
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
                        className={`flex w-14 h-6 text-3.5 lh-6 ${currentContent === 1 ? active : inactive}`}>专栏推荐
                </Button>
                {currentContent === 1 && (
                    <div className="ml-6 w-2.75 h-1 shrink-0 border-rd-2 bg-[#45E1B8]"></div>
                )}
            </div>

            <div>
                <Button type={'link'} size={'small'} onClick={() => setCurrentContent(2)}
                        className={`flex ml-10 w-14 h-6 text-3.5 lh-6 ${currentContent === 2 ? active : inactive}`}>有记小课
                </Button>
                {currentContent === 2 && (
                    <div className="ml-16 w-2.75 h-1 shrink-0 border-rd-2 bg-[#45E1B8]"></div>
                )}
            </div>

            <div>
                <Button type={'link'} size={'small'} onClick={() => setCurrentContent(3)}
                        className={`flex ml-10 w-14 h-6 text-3.5 lh-6 ${currentContent === 3 ? active : inactive}`}>共创计划
                </Button>
                {currentContent === 3 && (
                    <div className="ml-16 w-2.75 h-1 shrink-0 border-rd-2 bg-[#45E1B8]"></div>
                )}
            </div>
        </div>
        {renderContent()}
    </div>;
}
export default ComponentJump;
