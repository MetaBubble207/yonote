import {SortLabel} from "@/app/_components/special-column/SortLabel";
import {Card1} from "@/app/_components/special-column/Card1";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import React, {Suspense} from "react";


export const SpecialColumnContent=()=>{

    const params = useSearchParams();
    const columnId = params.get("id");
    const userId = api.column.getUserId.useQuery({ id: columnId }).data;
    const user = api.users.getOne.useQuery({ id: userId }).data;
    const postInfo = api.post.getAll.useQuery({
        columnId: columnId,
        limit: 100000,
        offset: 0,
    }).data;
    console.log(user)
    const SpecialColumnList = () => {
        return <>
                <Suspense>
                    {postInfo && postInfo.length > 0
                        && postInfo.map((item: any,index) => (

                            <div key={index}>
                                <Card1 key={item.id} item={item} user={user}/>
                            </div>)

                        )}
                </Suspense>
            </>
    }

    return(
        <div>
            <SortLabel/>
            <SpecialColumnList />
        </div>
    )
}
