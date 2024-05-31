"use client"
import Image from "next/image";
import { SpecialColumnBody } from "@/app/_components/special-column/SpecialColumnBody";
import {SpecialColumnHeader} from "@/app/_components/special-column/SpecialColumnHeader";
import {Suspense} from "react";
import {useSearchParams} from "next/navigation";
import {api} from "@/trpc/react";

const Page = () => {

    const params = useSearchParams();
    const columnId = params.get("id");
    const column = api.column.getColumnDetail.useQuery({
        columnId: columnId,
    }).data
    return(
        <div className={"w-full bg-[#F5F7FB] relative"}>
            <div className={"w-full absolute top-0 z-2 "}>
                <Suspense>
                    <SpecialColumnHeader></SpecialColumnHeader>
                </Suspense>
                {/*专栏主体*/}
                <Suspense>
                    <SpecialColumnBody></SpecialColumnBody>
                </Suspense>
            </div>
            <div className={"w-full absolute top-0 z-1 filter blur-sm"}>
                <Image src={column?.logo} alt={"bg"} width={375} height={74.5}
                       style={{width: "100%"}}/>
                <div className="absolute inset-0 bg-black opacity-20"></div>
            </div>
        </div>
    )
}

export default Page;
