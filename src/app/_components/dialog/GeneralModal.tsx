import React from "react"; // 引入 React

// 定义 GeneralModal 组件，接收 isOpen 和 children 作为 props
const GeneralModal = ({
  isOpen,
  onClick,
  children,
}: {
  isOpen: boolean;
  onClick: () => void | null;
  children: React.ReactNode;
}) => {
  // 如果 isOpen 是 false，则不显示模态框，直接返回 null
  if (!isOpen) {
    return null;
  }

  // 定义 modalClass 函数，返回模态框的样式类名字符串
  const modalClass = (): string => {
    // 返回样式类名字符串
    return "w-80 h-80";
  };

  // 渲染模态框
  return (
    <div className="z-101 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-white">
      {/* 模态框 */}
      <div
        className={
          "rounded-3px relative border border-gray-300 shadow-md " +
          modalClass()
        }
      >
        {/* 返回按钮 */}

        {/* 模态框的内容 */}
        {children}
        <div className="w-15 b-1 mt-100% ml-80% border-rd-10 flex shrink-0 justify-center border-black">
          <button onClick={onClick} className="text-4">
            返回
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralModal; // 导出 GeneralModal 组件
