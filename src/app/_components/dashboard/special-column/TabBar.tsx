import React from 'react';
import Image from 'next/image';

const CONSTANTS = {
    TABS: [
        { id: 2, label: "介绍" },
        { id: 1, label: "内容" },
    ],
    STYLES: {
        ACTIVE: "text-[#252525] font-500 border-b-3 border-[#45E1B8]",
        INACTIVE: "text-3.5 font-not-italic font-400 lh-6 text-[#B5B5B5]",
    },
    ICON_SIZE: 18,
} as const;

interface TabBarProps {
    currentContent: number;
    onTabChange: (tabId: number) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
    currentContent,
    onTabChange,
}) => (
    <div className="mt-[11px] ml-[16px] flex items-center">
        {CONSTANTS.TABS.map((tab) => (
            <button
                key={tab.id}
                className={`bg-transparent ${currentContent === tab.id ? CONSTANTS.STYLES.ACTIVE : CONSTANTS.STYLES.INACTIVE
                    } ${tab.id === 2 ? 'mr-40px' : ''}`}
                onClick={() => onTabChange(tab.id)}
            >
                {tab.label}
            </button>
        ))}

        <div className="ml-auto flex items-center">
            <Image
                src="/images/special-column/Magnifying glass.png"
                alt="搜索"
                width={CONSTANTS.ICON_SIZE}
                height={CONSTANTS.ICON_SIZE}
                className="mr-[24px] cursor-pointer"
            />
            <Image
                src="/images/special-column/Sort.png"
                alt="排序"
                width={CONSTANTS.ICON_SIZE}
                height={CONSTANTS.ICON_SIZE}
                className="mr-[16px] cursor-pointer"
            />
        </div>
    </div>
);