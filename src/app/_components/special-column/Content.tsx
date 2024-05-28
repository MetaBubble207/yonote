import {Categories} from "@/app/_components/special-column/Categories";
import {Card1} from "@/app/_components/special-column/Card1";
import {Card2} from "@/app/_components/special-column/Card2";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { log } from "console";


export const Content=()=>{

    const params = useSearchParams();
    const columnId = params.get("id");
    const chapter = parseInt(params.get("c"));

    const postInfo = api.post.getAll.useQuery({
        columnId: columnId,
        limit: 100000,
        offset: 0,
    }).data;
    

    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const Page = () => {
        return(
            <>
                {postInfo && postInfo.length > 0 && postInfo.map((item: any,index) => (

                    <div key={index}>
                        <Card1 key={item.id} item={item}/>
                    </div>)

                )}

            </>

            // <div>
            //     {post && post.length > 0 && post.map((item: any) => (
            //         <Card1 key={item.id}/>
            //     ))}
            // </div>
            
        )
        
    }
    
    console.log("post"+postInfo);
    console.log();
    
    

    const renderContent = (): React.ReactNode => {
        if (currentPage) {
            return (
                <div>
                    <Page />
                </div>
            )
        }

    }

    return(
        <div>
            {/*四个标签*/}
            <Categories/>
            {/*card1*/}
            {renderContent()}
            {/*card2*/}
            <Card2/>

        </div>
    )
}