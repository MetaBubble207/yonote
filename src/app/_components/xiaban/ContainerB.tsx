"use client"
import { usePathname, useRouter} from "next/navigation";
import {api} from "@/trpc/react";

export const ContainerB = () => {
    const pathname = usePathname();
    const router = useRouter();
    const updateUserApi = api.users.update.useMutation({
        onSuccess: (res) => {
            console.log(res)
        }
    })
    // const createPostApi = api.post.create.useMutation({
    //     onSuccess: (res) => {
    //         console.log(res)
    //     }
    // })
    const createUserApi = api.users.create.useMutation({
        onSuccess: (res)=> {
            console.log(res)
        }
    })
    const queryUserApi = api.users.getList.useQuery({
        limit: 5,
        offset: 3
    })

    const delUserApi = api.users.del.useMutation({
        onSuccess: (res) => {
            console.log(res)
    }
    })
    console.log(queryUserApi);
    const createUser = () => {
        createUserApi.mutate({
            name: "用户1"
        })
        // router.push("/a")
    }

    const updateUser = () => {
        updateUserApi.mutate({
            id: 1,
            name: "12312哇奥数"
        })
    }

    const delUser = () => {
        console.log(delUserApi.mutate({id:1}))
    }
    // const createPost = () => {
    //     createPostApi.mutate({
    //         name: "12312哇奥数"
    //     })
    // }
    return (
      <div>
        <button onClick={() => router.push("/a")}>路由回a</button>
          <br/>
          <button onClick={() => createUser()}>创建用户</button>
          <br/>
          <button onClick={() => updateUser()}>更新用户</button>
          <br/>
          <button onClick={() => delUser()}>删除用户</button>
          <br/>
          <div>{pathname}</div>
      </div>
    );
}
