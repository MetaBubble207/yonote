"use client"
import React from "react";
import {Button, Result} from "antd";
import {useRouter} from "next/navigation";

const Error = ({text}: { text: string }) => {
    const router = useRouter();
    return <div className={"w-full h-screen flex items-center justify-center"}>
        <Result
            status="500"
            title="500"
            subTitle={text}
            extra={<Button type="primary" onClick={() => router.back()}>返回上一级</Button>}
        />
    </div>
}

export default Error;