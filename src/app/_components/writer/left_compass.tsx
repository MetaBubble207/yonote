import React from "react";
import Image from "next/image";

const LeftCompass=()=>{

    return(
        <div>
            <div className="fixed top-17.5 w-64.77925 h-screen shrink-0 bg-[#FFF]">
                <div className="w-65.25 h-72.4785 shrink-0 flex items-center flex-col pt-4.27">
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#DAF9F1] flex">
                        <Image src={"/images/writer/Monitor1.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <span className="w-14 h-6.00625 shrink-0 text-[#4CC5A6] text-3.5 font-400 lh-6 ml-2.07 mt-2.89">主页看板</span>
                    </div>
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#FFF] flex">
                        <Image src={"/images/writer/Rocket2.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <span className="w-14 h-6.00625 shrink-0 text-[#999] text-3.5 font-400 lh-6ml-2.07 mt-2.89">内容管理</span>
                    </div>
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#FFF] flex">
                        <Image src={"/images/writer/Rocket3.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <span className="w-14 h-6.00625 shrink-0 text-[#999] text-3.5 font-400 lh-6 ml-2.07 mt-2.89">订阅管理</span>
                    </div>
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#FFF] flex">
                        <Image src={"/images/writer/Rocket4.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <span className="w-14 h-6.00625 shrink-0 text-[#999] text-3.5 font-400 lh-6 ml-2.07 mt-2.89">专栏设置</span>
                    </div>
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#FFF] flex">
                        <Image src={"/images/writer/Rocket5.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <span className="w-14 h-6.00625 shrink-0 text-[#999] text-3.5  font-400 lh-6 ml-2.07 mt-2.89">共创作者</span>
                    </div>
                    <div className="w-65.25 h-12.4705 shrink-0 bg-[#FFF] flex">
                        <Image src={"/images/writer/Rocket6.svg"} alt="Monitor1" width={24} height={24.03} className="w-6 h-6.00625 shrink-0 ml-10.555 mt-2.89"></Image>
                        <span className="w-14 h-6.00625 shrink-0 text-[#999] text-3.5 font-400 lh-6 ml-2.07 mt-2.89">加速计划</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

<<<<<<< HEAD:src/app/_components/writer/left_compass.tsx
export default Left_Compass;
=======
export default LeftCompass;
>>>>>>> a19d6e24917a5c0e2181a0ca411f0262d3d8427f:src/app/writer/left-compass/page.tsx
