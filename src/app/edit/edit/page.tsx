// "use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const DynamicMyEditor = dynamic(() => import("../../_components/edit/editor"), {
  ssr: false,
});
const Page = () => {
  return (
    <div className="w-full h-full">
      <DynamicMyEditor></DynamicMyEditor>
    </div>
  );
};

export default Page;
