import React from 'react'; // 引入 React

// 定义 GeneralModal 组件，接收 isOpen 和 children 作为 props
export const W100H50Modal = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray bg-opacity-50 flex justify-center items-center z-101">
            {/* 模态框 */}
            <div className={"bg-#fff w-100 h-50 flex rounded-4 flex-col justify-center items-center"}>
                {/* 模态框的内容 */}
                {children}
            </div>
        </div>
    );
};
