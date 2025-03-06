import './reserved.css'
import { api } from "@/trpc/react";
import { Drawer, message } from "antd";
import Image from "next/image";
import Loading from "../common/Loading";
import { useEffect } from "react";
import { ColumnSelect } from "@/server/db/schema";

export const ShareDialog = ({
    open,
    onClose,
    columnData,
    handleClickShare,
    handleClickCopy
}: {
    open: boolean;
    onClose: () => void;
    columnData: ColumnSelect;
    handleClickShare: () => void;
    handleClickCopy: () => void;
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { data: distributorshipData, isLoading } = api.distributorshipDetail.getOne.useQuery(
        columnData.id,
        { enabled: Boolean(columnData.distributorship === true) }
    );

    useEffect(() => {
        if (!isLoading && !distributorshipData) {
            messageApi.error('获取加速计划数据失败');
            onClose();
        }
    }, [distributorshipData, isLoading, messageApi, onClose]);
    
    if (isLoading) return <Loading />;
    return <Drawer
        title={null}
        open={open}
        onClose={onClose}
        closable={false}
        placement='bottom'
        height={'auto'}
        className='min-h-208px rounded-t-30px'
    >
        {contextHolder}
        <div className="flex min-h-160px flex-col justify-between items-center">
            <Image
                src="/images/dialog/Close-small.png"
                alt="close"
                width={20}
                height={20}
                className="w-20px h-20px cursor-pointer ml-79"
                onClick={onClose}
            />
                <span className='text-15px'>分享</span>

            <div className='flex flex-col items-center mt-10'>
                <div className='flex-1'>
                    {
                        columnData.distributorship && distributorshipData && (
                            <div>
                                <div>【{columnData.name}】已开启-加速计划</div>
                                <div>分享海报与链接助力创作者，成交后您可以获得当前作品价格的{distributorshipData.distributorship * 100}%作为加速激励</div>
                            </div>
                        )
                    }
                    <button
                        onClick={handleClickShare}
                        className="w-84 h-40px bg-#5CE5C1 rounded-full flex items-center justify-center"
                    >
                        <span className="fw-500">分享海报</span>
                    </button>
                    <button
                        onClick={handleClickCopy}
                        className="w-84 h-40px mt-4 bg-#F5F7FB rounded-full flex items-center justify-center"
                    >
                        <span className="fw-500">分享链接</span>
                    </button>
                </div>
            </div>
        </div>
    </Drawer>;
};