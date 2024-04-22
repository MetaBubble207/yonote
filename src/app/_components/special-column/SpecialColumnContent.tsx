"use client"
import Image from "next/image";
import React, { useState } from 'react';
import {Content} from "@/app/_components/special-column/Content";
import {Card2} from "@/app/_components/special-column/Card2";


export const SpecialColumnContent = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const [currentContent, setCurrentContent ] = useState<number>(1);
    const active = "text-[#252525] font-500 border-b-3 border-[#45E1B8]";
    const renderContent = () => {
        switch (currentContent){
            case 1:
                return <Content></Content>;
            case 2:
                return <Card2></Card2>;

        }
    }
    return(
        <div>
            <div className="flex mt-11px items-center ml-16px">
                <div className={currentContent === 2 ? active:"text-[#B5B5B5] text-3.5 font-not-italic font-400 lh-6 " } onClick={() => setCurrentContent(2)} style={{marginRight:'40px'}}>介绍</div>
                <div className={currentContent === 1 ? active:"text-[#B5B5B5] text-3.5 font-not-italic font-400 lh-6 "} onClick={() => setCurrentContent(1)} >内容</div>
                <div className="ml-auto mr-24px">
                    <Image src={"/images/special-column/Magnifying glass.png"} alt={"心智与阅读"} width={18} height={18}/>
                </div>
                <div className={"mr-16px"}>
                    <Image src={"/images/special-column/Sort.png"} alt={"心智与阅读"} width={18} height={18}/>
                </div>
            </div>
            {renderContent()}
        </div>
    )
}
