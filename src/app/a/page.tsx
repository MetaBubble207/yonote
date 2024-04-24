"use client"
import {Toggle} from "@/app/_components/xiaban/Toggle";
import {api} from "@/trpc/react";

const Page = () => {
    const a = api.post.hello.useQuery(
        {
           text: "123"
        }
    );
    const addPost = api.post.create.useMutation({
        onSuccess: (data) => {
            console.log(data)
        }
    });
    const testAdd = () => {
        addPost.mutate({
            name:"哈哈"
        })
    }
    // console.log(a?.data?.greeting);
    return <div>
        <button onClick={() => testAdd()}>点击我</button>
        <Toggle></Toggle>
    </div>
}

export default Page
