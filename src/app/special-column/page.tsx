"use client"

import Image from "next/image";
import { SpecialColumnBody } from "@/app/_components/special-column/SpecialColumnBody";
import { api } from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { check } from "drizzle-orm/mysql-core";
import Reserved from "@/app/_components/dialog/dialog/reserved"
import {SpecialColumnHeader} from "@/app/_components/special-column/SpecialColumnHeader";

const Page = () => {
    const params = useSearchParams();
    const columnId = params.get("id");

    return(
    <div className={"w-full bg-[#F5F7FB] relative"}>
        <div className={"w-full absolute top-0 z-2 "}>
            <SpecialColumnHeader columnId={columnId}></SpecialColumnHeader>
            {/*专栏主体*/}
            <SpecialColumnBody columnId={columnId}></SpecialColumnBody>
        </div>
        <div className={"w-full absolute top-0 z-1 filter blur-sm"}>
            <Image src={"/images/special-column/Cardpc.png"} alt={"bg"} width={375} height={74.5} style={{ width: "100%" }} />
            <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
    </div>
    )
}

export default Page;
