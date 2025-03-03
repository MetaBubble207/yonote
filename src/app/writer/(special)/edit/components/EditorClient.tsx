"use client"
import dynamic from "next/dynamic";
import { EditorProps } from "../types";
// 使用动态导入并禁用 SSR
const MyEditor = dynamic(
    () => import("@/app/writer/(special)/edit/components/MyEditor"),
    { ssr: false }
  );
export const EditorClient = (props: EditorProps) => {
    return <MyEditor {...props} />
}