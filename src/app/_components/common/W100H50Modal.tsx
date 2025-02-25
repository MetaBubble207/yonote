import React from "react"; // 引入 React

// 定义 GeneralModal 组件，接收 isOpen 和 children 作为 props
const W100H50Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-black z-101 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-opacity-50">
      {/* 模态框 */}
      <div
        className={
          "bg-#fff w-100 h-50 rounded-4 flex flex-col items-center justify-center"
        }
      >
        {/* 模态框的内容 */}
        {children}
      </div>
    </div>
  );
};

export default W100H50Modal;
