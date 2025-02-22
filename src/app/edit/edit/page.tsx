"use client";
import dynamic from "next/dynamic";
import withTheme from "@/theme";

const DynamicMyEditor = dynamic(
  () => import("@/app/_components/edit/MyEditor"),
  {
    ssr: false,
  },
);
const Page = () => {
  return (
    <div className="h-full w-full">
      {withTheme(<DynamicMyEditor></DynamicMyEditor>)}
    </div>
  );
};

export default Page;
