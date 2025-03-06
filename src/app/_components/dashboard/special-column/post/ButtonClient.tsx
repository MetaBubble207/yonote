"use client"
import { ColumnSelect, PostSelect } from "@/server/db/schema";
import { useCallback, useState } from "react";
import ActionButtons from "../ActionButton";
import { ShareDialog } from "@/app/_components/dialog/ShareDialog";
import { message } from "antd";
import { useRouter } from "next/navigation";

export const ButtonClient = ({ columnData, postDetailData }: { columnData: ColumnSelect, postDetailData: PostSelect }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [openShare, setOpenShare] = useState(false);
    const handleClickShareIcon = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenShare(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenShare(false);
    }, []);

    const router = useRouter();
    
    const handleClickShare = useCallback(() => {
        setOpenShare(false);
        router.push(`/dashboard/poster/post?id=${columnData.id}&c=${postDetailData.chapter}`);
    }, [columnData, router]);

    const handleClickCopy = async () => {
        const currentUrl = `${window.location.origin}/dashboard/special-column?id=${columnData.id}`;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(currentUrl);

                messageApi.success("复制成功");
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = currentUrl;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    const successful = document.execCommand('copy');
                    if (!successful) throw new Error('复制失败');
                } finally {
                    textArea.remove();
                }
                messageApi.success("复制成功");
            }
        } catch (err) {
            messageApi.error("复制失败，请重试");
        } finally {
            setOpenShare(false);
        }
    };
    return <>
        {contextHolder}
        <ActionButtons handleClickShareIcon={handleClickShareIcon} showSpeedPlanIcon={columnData?.distributorship ?? false} />
        <ShareDialog open={openShare} onClose={handleClose}
            columnData={columnData} handleClickShare={handleClickShare} handleClickCopy={handleClickCopy}
        />
    </>
}