"use client";
import React, { useState } from "react";
import CoCreate from "@/app/_components/dashboard/recommend/CoCreate";
import { CommonList } from "@/app/_components/dashboard/recommend/CommonList";

interface TabItem {
  id: number;
  label: string;
  component: React.ReactNode;
}

export default function Page() {
  const [currentContent, setCurrentContent] = useState<number>(1);

  const tabs: TabItem[] = [
    { id: 1, label: "专栏推荐", component: <CommonList type={0} /> },
    { id: 2, label: "有记小课", component: <CommonList type={1} /> },
    { id: 3, label: "共创计划", component: <CoCreate /> },
  ];

  return (
    <div className="bg-#F5F7FB min-h-screen w-full pt-8">
      <div className="flex h-6 w-full items-center pl-4">
        {tabs.map((tab) => (
          <div key={tab.id}>
            <button
              onClick={() => setCurrentContent(tab.id)}
              className={`text-3.5 lh-6 flex h-6 w-14 bg-transparent ${tab.id !== 1 ? "ml-10" : ""
                } ${currentContent === tab.id ? "text-#252525" : "text-#B5B5B5"}`}
            >
              {tab.label}
            </button>
            {currentContent === tab.id && (
              <div
                className={`w-2.75 border-rd-2 h-1 shrink-0 bg-[#45E1B8] ${tab.id === 1 ? "ml-6" : "ml-16"
                  }`}
              />
            )}
          </div>
        ))}
      </div>
      {tabs.find(tab => tab.id === currentContent)?.component}
    </div>
  );
};
