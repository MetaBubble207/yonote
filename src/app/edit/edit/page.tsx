"use client";
import dynamic from "next/dynamic";
import withTheme from "@/theme";

const DynamicMyEditor = dynamic(() => import("@/app/_components/edit/MyEditor"), {
    ssr: false,
});
const Page = () => {
    return (
        <div className="w-full h-full">
            {withTheme(<DynamicMyEditor></DynamicMyEditor>)}
        </div>
    );
};

export default Page;
