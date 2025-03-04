"use client";
import React, { useState, useMemo } from "react";
import SubscribeManage from "./SubscribeManage";
import UserUpdate from "./UserUpdate";
import UserColumn from "./UserColumn";
import UserCourse from "./UserCourse";
import useCheckOnClient from "@/app/_hooks/useCheckOnClient";
import useCheckLoginState from "@/app/_hooks/useCheckLoginState";

interface TabItem {
  id: 1 | 2 | 3;
  label: string;
}

const TABS: TabItem[] = [
  { id: 1, label: "更新" },
  { id: 2, label: "专栏" },
  { id: 3, label: "小课" },
] as const;
const SubscribeMain = ({code}:{code?: string}) => {
  const mounted = useCheckOnClient();
  const {token} = useCheckLoginState('/login?origin=/dashboard/subscribe', code, mounted);

  const [currentPage, setCurrentPage] = useState<TabItem["id"]>(1);

  const TabButton = useMemo(() => {
    const TabButtonComponent = ({ button }: { button: TabItem }) => {
      const isActive = currentPage === button.id;
      return (
        <button
          key={button.id}
          onClick={() => setCurrentPage(button.id)}
          className={`flex flex-col items-center justify-center text-3 bg-transparent ${isActive ? "text-#45E1B8 fw-500" : ""
            }`}
        >
          {button.label}
          <div
            className={`w-2.75 rounded-2 m-auto h-1 ${isActive ? "bg-#45E1B8" : ""
              }`}
          />
        </button>
      );
    };
    TabButtonComponent.displayName = 'TabButton';
    return TabButtonComponent;
  }, [currentPage]);

  const renderContent = () => {
    if (!mounted) return null;

    switch (currentPage) {
      case 1:
        return <UserUpdate token={token} />;
      case 2:
        return <UserColumn token={token} />;
      case 3:
        return <UserCourse />;
      default:
        return null;
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-4.5 flex space-x-8">
          {TABS.map((button) => (
            <TabButton key={button.id} button={button} />
          ))}
        </div>
        {/* 订阅管理 */}
        <SubscribeManage />
      </div>
      <div className="mt-3.5">{renderContent()}</div>
    </>
  );
};

export default SubscribeMain;