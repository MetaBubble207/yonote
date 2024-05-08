"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import {api} from "@/trpc/react";
import Image from "next/image";

const LoginCallback = () => {
  const searchParams = useSearchParams();
  //这个地址是提前给微信登录接口重定向，默认微信那边会传回code和state两个query参数，通过useSearchParams可以拿到
  const code = searchParams.get("code");
  const res = api.users.getAccessToken.useQuery({
    code:code!
  })
 useEffect(() => {
    // 获取网页地址
  const targetOrigin = window.location.origin
  window.postMessage(code, targetOrigin)
  }, [code])


  console.log("res == ",res)
//   loader={() => res.data.headimgurl } 
  return (
    <div>
      <h1>
        {
        res.data
            ?
            <div>
                {res.data.headimgurl ? <Image priority src={res.data.headimgurl} alt={"avatar"} width={100} height={100}/> : <span></span> }
              <div>{res.data.nickname}</div>
            </div>
            :
            <div>登录中</div>
      }
      </h1>
    </div>
  );
};
export default function Page() {
  return (
    <Suspense>
      <LoginCallback></LoginCallback>
    </Suspense>
  );
}
