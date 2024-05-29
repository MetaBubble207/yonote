import {SortLabel} from "@/app/_components/special-column/SortLabel";
import {SpecialColumnCard} from "@/app/_components/special-column/SpecialColumnCard";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import React, {Suspense} from "react";


export const SpecialColumnList=()=>{

    const params = useSearchParams();
    const columnId = params.get("id");
    const userId = api.column.getUserId.useQuery({ id: columnId }).data;
    const user = api.users.getOne.useQuery({ id: userId }).data;

    const postInfo = api.post.getAllInOrder.useQuery({
        columnId: columnId,
        limit: 100000,
        offset: 0,
    }).data;
    const Body = () => {
        return <>
                <Suspense>
                    {postInfo && postInfo.length > 0
                        && postInfo.map((item: any,index) => (
                            <SpecialColumnCard key={item.id} index={index} item={item} user={user}/>
                        ))
                    }
                </Suspense>
            </>
    }

    return(
        <div>
            <SortLabel/>
            <Body />
        </div>
    )
}
