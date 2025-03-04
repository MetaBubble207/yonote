import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Checkbox, Drawer, message } from "antd";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";
import { setSubscribeColumnList, userSubscribeSelector } from "@/app/_slice/user-subscribe-slice";
import { api } from "@/trpc/react";
import { BaseColumnCard, BaseColumnCardDateString } from "@/server/db/schema";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { useAppDispatch, useAppSelector } from "@/app/_hooks/useRedux";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";
import NoData from "../../common/NoData";

// 常量配置
const CONSTANTS = {
  DRAWER_HEIGHT: 494,
  MAX_NAME_LENGTH: 20,
  MAX_INTRO_LENGTH: 50,
  LOADING_SKELETON_COUNT: 4,
  COLORS: {
    ACTIVE_BG: "rgba(69,225,184,0.20)",
    ACTIVE_TEXT: "#1DB48D",
    INACTIVE_BG: "#F5F7FB",
    INACTIVE_TEXT: "#999999",
  },
} as const;

// Tab 配置
const TABS = [
  { id: 0, label: "专栏" },
  { id: 1, label: "小课" },
] as const;

type TabId = typeof TABS[number]['id'];

// 组件接口定义
interface TabButtonProps {
  tab: typeof TABS[number];
  isActive: boolean;
  onClick: (id: TabId) => void;
}

// 子组件
const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onClick }) => (
  <button
    className={`w-17 rounded-4px h-6 ${isActive
      ? `bg-[${CONSTANTS.COLORS.ACTIVE_BG}] text-[${CONSTANTS.COLORS.ACTIVE_TEXT}]`
      : `bg-[${CONSTANTS.COLORS.INACTIVE_BG}] text-[${CONSTANTS.COLORS.INACTIVE_TEXT}]`
      } ${tab.id === 1 ? 'ml-6' : ''}`}
    onClick={() => onClick(tab.id)}
  >
    {tab.label}
  </button>
);

const ColumnItem: React.FC<{
  item: BaseColumnCardDateString;
  index: number;
  isManaging: boolean;
  onVisibilityChange: (index: string, visible: boolean) => void;
}> = ({ item, index, isManaging, onVisibilityChange }) => (
  <Checkbox
    key={item.id}
    value={index}
    className="flex flex-row"
    checked={item.isVisible}
    onChange={(e) => onVisibilityChange(item.id, e.target.checked)}
    disabled={!isManaging}
  >
    <div className="flex">
      <div className="relative w-11.5 h-15">
        <Image
          src={item.cover ?? NotImage()}
          alt="cover"
          className="rounded-2 object-cover"
          placeholder="blur"
          blurDataURL={LoadingImage()}
          quality={100}
          fill
          loading="lazy"
        />
      </div>
      <div className="ml-3 mt-3 flex flex-col">
        <div className="text-3 font-500 lh-6 text-[#252525]">
          {truncateText(item.name, CONSTANTS.MAX_NAME_LENGTH)}
        </div>
        <div className="text-2.5 lh-[120%] mt-1 text-[#666]">
          {item.introduce
            ? truncateText(item.introduce, CONSTANTS.MAX_INTRO_LENGTH)
            : "该专栏还没有设置简介"}
        </div>
      </div>
    </div>
  </Checkbox>
);

// 工具函数
const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return "";
  return text.length >= maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const serializeColumnData = (column: BaseColumnCard) => ({
  ...column,
  createdAt: column.createdAt?.toISOString(),
  updatedAt: column.updatedAt?.toISOString(),
});

// 主组件
const SubscribeManage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabId>(0);
  const [isManaging, setIsManaging] = useState(false);
  const [token] = useLocalStorage("token", "");
  const [columnsState, setColumnsState] = useState<BaseColumnCardDateString[]>([]);

  const { subscribeColumnList } = useAppSelector(userSubscribeSelector);
  const dispatch = useAppDispatch();

  const { data: columns, isLoading } = api.column.getSubscriptColumn.useQuery(
    { userId: token },
    { enabled: Boolean(token && subscribeColumnList.length === 0) }
  );

  const [messageApi, contextHolder] = message.useMessage();
  const changeVisible = api.order.updateOrderVisible.useMutation({
    onSuccess: () => {
      messageApi.success("保存成功");
    }
  });

  // 副作用处理
  useEffect(() => {
    if (columns) {
      const serializedData = columns.map(serializeColumnData);
      dispatch(setSubscribeColumnList(serializedData));
    }
  }, [columns, dispatch]);

  useEffect(() => {
    if (subscribeColumnList) {
      setColumnsState(subscribeColumnList);
    }
  }, [subscribeColumnList]);

  // 事件处理
  const handleSave = useCallback(() => {
    const newState = [...columnsState];
    dispatch(setSubscribeColumnList(newState));
    setOpen(false);

    changeVisible.mutate(newState.map(item => ({
      columnId: item.id,
      isVisible: item.isVisible ?? false,
      userId: token,
    })));
  }, [columnsState, changeVisible, dispatch, token]);

  const handleChange = useCallback((columnId: string, visible: boolean) => {
    console.log('index =>', columnId);

    setColumnsState(prev => prev.map((item, i) =>
      item.id === columnId ? { ...item, isVisible: visible } : item
    ));
  }, []);

  const handleManage = useCallback(() => {
    if (isManaging) {
      handleSave();
    }
    setIsManaging(!isManaging);
  }, [isManaging, handleSave]);

  // 渲染方法
  const renderColumnList = (type: number) => {
    if (isLoading) return <LoadingSkeleton count={CONSTANTS.LOADING_SKELETON_COUNT} />;
    const renderColumn = columnsState?.filter(item => item.type === type);
    if (renderColumn.length === 0) return <NoData title={`还没有订阅的${type === 0 ? "专栏" : "小课"}噢😯~`} />
    return (
      <div className="w-85.75 h-20.471 bg-#fff rounded-2.5 m-auto flex">
        <div className="w-100% mt-2 flex flex-col space-y-4">
          {renderColumn.map((item, index) => (
            <ColumnItem
              key={item.id}
              item={item}
              index={index}
              isManaging={isManaging}
              onVisibilityChange={handleChange}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {contextHolder}
      <div className="flex items-center">
        <Image
          src="/images/subscribe/manage.svg"
          width={12}
          height={12}
          alt="manage"
          className="pt-0.5"
        />
        <button
          onClick={() => setOpen(true)}
          className="text-2.5 lh-6 ml-0.5 text-[#B5B5B5] bg-transparent"
        >
          订阅管理
        </button>
      </div>
      <Drawer
        placement="bottom"
        closable
        onClose={() => setOpen(false)}
        open={open}
        height={CONSTANTS.DRAWER_HEIGHT}
        style={{ borderRadius: "20px" }}
      >
        <div>
          <h2 className="text-3.5 font-500 lh-6 text-[#252525]">订阅管理</h2>
          <div className="mb-4.5 mr-4 mt-9 flex justify-between">
            <div className="font-400 lh-6 flex justify-center">
              {TABS.map(tab => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={selectedTab === tab.id}
                  onClick={setSelectedTab}
                />
              ))}
            </div>
            <button
              onClick={handleManage}
              className={`text-${CONSTANTS.COLORS.ACTIVE_TEXT} text-3 font-500 bg-transparent border-none`}
            >
              {isManaging ? "保存" : "管理"}
            </button>
          </div>
          {renderColumnList(selectedTab)}
        </div>
      </Drawer>
    </div>
  );
};

export default SubscribeManage;
