import React from 'react';
import { api } from "@/trpc/server";

interface ErrorDisplayProps {
    title: string;
    message?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ title, message = "请刷新页面重试" }) => (
    <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-gray-500">{message}</p>
        </div>
    </div>
);

export async function validateColumn(columnId: string | undefined) {
    if (!columnId) {
        return {
            isValid: false,
            error: <ErrorDisplay title="数据加载失败" />
        };
    }

    const columnData = await api.column.getById(columnId);

    if (!columnData) {
        return {
            isValid: false,
            error: <ErrorDisplay title="专栏不存在" />
        };
    }

    return {
        isValid: true,
        columnData
    };
}