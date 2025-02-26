import React from 'react';

const CONSTANTS = {
    TABS: [
        { id: 2, label: "介绍" },
        { id: 1, label: "内容" },
    ],
    STYLES: {
        ACTIVE: "text-[#252525] font-500 border-b-3 border-[#45E1B8]",
        INACTIVE: "text-3.5 font-not-italic font-400 lh-6 text-[#B5B5B5]",
    },
} as const;

interface TabBarProps {
    currentContent: number;
    onTabChange: (tabId: number) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
    currentContent,
    onTabChange,
}) => (
    <div>
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
    </div>
);