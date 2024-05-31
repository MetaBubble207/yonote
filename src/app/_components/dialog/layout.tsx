"use client";


import Image from "next/image";
import React from "react";
// import { useRouter } from "next/navigation";
import { TRPCReactProvider } from "@/trpc/react";


const dialogLayout=({children}:{children:React.ReactNode})=>{
    // const router = useRouter();

    const closeModal = () => {
        // router.back();
    }

    return(

        <html>
            <body>
                
                <div className="flex items-center w-full h-full bg-[#606062] z-1">
                    <div className="w-93.75 h-82.25 mt-120.75 shrink-0 border-rd-[20px_20px_0px_0px] bg-[#FFF]">
                        <button className="w-6 h-6 shrink-0 ml-83.75 mt-4" onClick={closeModal}>
                            <Image src={"/images/dialog/close-small.png"} alt={"close"} width={24} height={24}></Image>
                        </button>
                        <TRPCReactProvider>{children}</TRPCReactProvider>
                    </div>
                </div>
            </body>
        </html>
    );

}

export default dialogLayout;
