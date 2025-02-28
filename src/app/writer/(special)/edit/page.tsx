"use client";
import dynamic from "next/dynamic";

const DynamicMyEditor = dynamic(
  () => import("@/app/_components/edit/MyEditor"),
  {
    ssr: false,
  },
);
const Page = () => {
  return (
    <div className="h-full w-full">
      <DynamicMyEditor></DynamicMyEditor>
    </div>
  );
};

export default Page;
