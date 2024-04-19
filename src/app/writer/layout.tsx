"use client";


import Image from "next/image";
import React from "react";
import styles from './writer.css';


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
                <div className={styles.root}>
                    <div className="w-360 h-225 bg-[#F6F6F6] font-size-16px" >
                        <TRPCReactProvider>{children}</TRPCReactProvider>
                    </div>
                </div>
            </body>
        </html>
    );

}

export default dialogLayout;
