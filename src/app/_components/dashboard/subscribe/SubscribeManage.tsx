import React, { useRef, useState, useCallback } from "react";
import ManagementColumn from "./ManagementColumn";
import ManagementClass from "./ManagementClass";
import Image from "next/image";
import { Button, Drawer } from "antd";

interface TabConfig {
  id: 1 | 2;
  label: string;
}

const TABS: TabConfig[] = [
  { id: 1, label: "专栏" },
  { id: 2, label: "小课" },
] as const;

const DRAWER_HEIGHT = 494;
const ACTIVE_BG_COLOR = "rgba(69,225,184,0.20)";
const ACTIVE_TEXT_COLOR = "#1DB48D";
const INACTIVE_BG_COLOR = "#F5F7FB";
const INACTIVE_TEXT_COLOR = "#999999";

const SubscribeManage = () => {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabConfig["id"]>(1);
  const [isManaging, setIsManaging] = useState(false);
  const columnRef = useRef<{ handleSave: () => void } | null>(null);

  const handleDrawerOpen = useCallback(() => setOpen(true), []);
  const handleDrawerClose = useCallback(() => setOpen(false), []);

  const handleManage = useCallback(() => {
    if (columnRef.current && isManaging) {
      columnRef.current.handleSave();
      setOpen(false);
    }
    setIsManaging(!isManaging);
  }, [isManaging]);

  const handleTabChange = useCallback((tabId: TabConfig["id"]) => {
    setSelectedTab(tabId);
  }, []);

  const TabButton = ({ tab }: { tab: TabConfig }) => {
    const isActive = selectedTab === tab.id;
    return (
      <button
        className={`w-17 rounded-4px h-6 ${isActive
          ? `bg-[${ACTIVE_BG_COLOR}] text-[${ACTIVE_TEXT_COLOR}]`
          : `bg-[${INACTIVE_BG_COLOR}] text-[${INACTIVE_TEXT_COLOR}]`
          } ${tab.id === 2 ? 'ml-6' : ''}`}
        onClick={() => handleTabChange(tab.id)}
      >
        {tab.label}
      </button>
    );
  };

  const DrawerContent = () => (
    <>
      <h2 className="text-3.5 font-500 lh-6 text-[#252525]">订阅管理</h2>
      <div className="mb-4.5 mr-4 mt-9 flex justify-between">
        <div className="font-400 lh-6 flex justify-center">
          {TABS.map(tab => (
            <TabButton key={tab.id} tab={tab} />
          ))}
        </div>
        <button
          onClick={handleManage}
          className={`text-${ACTIVE_TEXT_COLOR} text-3 font-500 bg-transparent border-none`}
        >
          {isManaging ? "保存" : "管理"}
        </button>
      </div>
      {selectedTab === 1 && (
        <ManagementColumn manage={isManaging} ref={columnRef} />
      )}
      {selectedTab === 2 && <ManagementClass manage={isManaging} />}
    </>
  );

  return (
    <div>
      <div className="flex items-center">
        <Image
          src="/images/subscribe/manage.svg"
          width={12}
          height={12}
          alt="manage"
          className="pt-0.5"
        />
        <button
          onClick={handleDrawerOpen}
          className="text-2.5 lh-6 ml-0.5 text-[#B5B5B5] bg-transparent"
        >
          订阅管理
        </button>
      </div>
      <Drawer
        placement="bottom"
        closable
        onClose={handleDrawerClose}
        open={open}
        height={DRAWER_HEIGHT}
        style={{ borderRadius: "20px" }}
      >
        <DrawerContent />
      </Drawer>
    </div>
  );
};

export default SubscribeManage;
