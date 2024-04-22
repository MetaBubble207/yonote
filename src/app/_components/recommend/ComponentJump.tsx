"use client"
import {useState} from "react";
import {SpecialColumn} from "@/app/_components/recommend/SpecialColumn";
import {YonoteCourse} from "@/app/_components/recommend/YonoteCourse";
import {CoCreate} from "@/app/_components/recommend/CoCreate";


export const ComponentJump = () => {
    const [currentContent, setCurrentContent ] = useState<number>(1);
    const active = "text-red bg-gray-200";
    const renderContent = () => {
        switch (currentContent){
            case 1:
                return <SpecialColumn/>;
            case 2:
                return <YonoteCourse/>;
            case 3:
                return <CoCreate/>;
            
        }
    }
    return <div>
        <div className={"flex items-center w-full h-6 ml-4"}>
            <button onClick={() => setCurrentContent(1)}
                    className={`flex w-14 h-6 text-[#252525] text-3.5 font-500 lh-6 ${currentContent === 1 ? active : ""}`}>专栏推荐</button>
            <button onClick={() => setCurrentContent(2)}
                    className={`flex ml-10 w-14 h-6 text-[#B5B5B5] text-3.5 font-400 lh-6 ${currentContent === 2 ? active : ""}`}>有记小课</button>
            <button onClick={() => setCurrentContent(3)}
                    className={`flex ml-10 w-14 h-6 text-[#B5B5B5] text-3.5 font-400 lh-6 ${currentContent === 3 ? active : ""}`}>共创计划</button>
           
        </div>
        {renderContent()}
    </div>;
}
export default ComponentJump;
