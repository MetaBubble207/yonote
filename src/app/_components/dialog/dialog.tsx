import React from 'react'; // 引入 React

// 定义 GeneralModal 组件，接收 isOpen 和 children 作为 props
const GeneralModal = ({ isOpen, onClick, children }: { isOpen: boolean, onClick: () => void | null, children: React.ReactNode }) => {
    // 如果 isOpen 是 false，则不显示模态框，直接返回 null
    if (!isOpen) {
        return null;
    }

    // 定义 modalClass 函数，返回模态框的样式类名字符串
    const modalClass = (): string => {
        // 返回样式类名字符串
        return "w-80 h-80";
    }

    // 渲染模态框
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white z-101">
            {/* 模态框 */}
            <div className={"rounded-3px border border-gray-300 shadow-md relative " + modalClass()}>
                {/* 返回按钮 */}
                
                {/* 模态框的内容 */}
                {children}
                <div className='w-15 shrink-0 b-1 border-black flex mt-100% ml-80% border-rd-10 justify-center'>
                    <button onClick={onClick}  className='text-4'>返回</button>
                </div>
            </div>
        </div>
    );
};

export default GeneralModal; // 导出 GeneralModal 组件