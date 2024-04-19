"use client"
import {useState} from "react";
import {Content1} from "@/app/_components/xiaban/Content1";
import {Content2} from "@/app/_components/xiaban/Content2";
import {Content3} from "@/app/_components/xiaban/Content3";
import {Content4} from "@/app/_components/xiaban/Content4";

export const Toggle = () => {
    const [currentContent, setCurrentContent ] = useState<number>(1);
    const active = "text-red bg-gray-200";
    const renderContent = () => {
        switch (currentContent){
            case 1:
                return <Content1></Content1>;
            case 2:
                return <Content2></Content2>;
            case 3:
                return <Content3></Content3>;
            case 4:
                return <Content4></Content4>;
        }
    }
    return <div>
        <div className={"space-y-10px flex flex-col"}>
            <button onClick={() => setCurrentContent(1)}
                    className={currentContent === 1 ? active : ""}>page1</button>
            <button onClick={() => setCurrentContent(2)}
                    className={currentContent === 2 ? active : ""}>page2</button>
            <button onClick={() => setCurrentContent(3)}
                    className={currentContent === 3 ? active : ""}>page3</button>
            <button onClick={() => setCurrentContent(4)}
                    className={currentContent === 4 ? active : ""}>page4</button>
        </div>
        {renderContent()}
    </div>;
}
