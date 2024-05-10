// @ts-nocheck

"use client"
import { usePathname, useRouter} from "next/navigation";
import {api} from "@/trpc/react";
import {type User} from "@/server/db/schema";
import {useState} from "react";

export const ContainerB = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<User>({
        id: undefined,
        name:'',
    });

    const updateUserApi = api.users.update.useMutation({
        onSuccess: (res) => {
            console.log(res)
        }
    })

    const createUserApi = api.users.create.useMutation({
        onSuccess: (res)=> {
            console.log(res[0]?.name);
        }
    })
    //@ts-ignore
    const queryUser = api.users.getList.useQuery({
        limit: 5,
        offset: 0
    }).data as User[]

    const delUserApi = api.users.del.useMutation({
        onSuccess: (res) => {
            console.log(res)
    }
    })
    const createUser = () => {
        createUserApi.mutate({
            name: userInfo.name!
        })
        // router.push("/a")
    }

    const updateUser = () => {
        // @ts-ignore
        updateUserApi.mutate({
            id: 6,
            name: "12312哇奥数"
        })
    }

    const delUser = () => {
        console.log(delUserApi.mutate({id:1}))
    }

    return (
      <div>
          <div>
              {queryUser?.map((user: User) => (
                  <div key={user.id} className={"flex mb-10px space-x-10px"}>
                      <div>{user.name}</div>
                      <div>{user.createdAt?.valueOf()}</div>
                      <div>{user.updatedAt?.valueOf()}</div>
                  </div>
              ))}
          </div>
        <button onClick={() => router.push("/a")}>路由回a</button>
          <br/>
          <label>姓名</label>
          <input type="text" value={userInfo.name!} onChange={(e) => {
              const userTemp:User = {};
              Object.assign(userTemp, userInfo)
              userTemp.name = e.target.value;
              setUserInfo(userTemp);
          }} />
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
