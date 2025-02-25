import React from 'react';

interface SubscribeButtonProps {
    onClick: () => void;
    show: boolean;
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({ onClick, show }) => {
    if (!show) return null;

    return (
        <div className="fixed bottom-2">
            <div className="w-85.75 ml-[16px] h-10 rounded-full">
                <button
                    className="w-full h-full rounded-full bg-[#5CE5C1]"
                    onClick={onClick}
                >
                    订阅
                </button>
            </div>
        </div>
    );
};