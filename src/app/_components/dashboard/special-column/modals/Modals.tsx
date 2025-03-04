"use client"
import { Modal, Input } from "antd";
const { Search } = Input;
import { PaymentInfo, PaymentState } from "@/app/_types/payment";

interface PaymentModalsProps {
    state: PaymentState;
    setState: React.Dispatch<React.SetStateAction<PaymentState>>;
    paymentInfo: PaymentInfo;
    handleRecharge: (amount: number) => void;
    columnData: {
        type: number;
        name: string;
    };
    balance: number;
}

export const PaymentModals: React.FC<PaymentModalsProps> = ({
    state,
    setState,
    paymentInfo,
    handleRecharge,
    columnData,
    balance,
}) => {
    return (
        <>
            <Modal
                title="充值对话框"
                open={state.showTopUp}
                onCancel={() => setState(prev => ({ ...prev, showTopUp: false }))}
                onOk={() => handleRecharge(state.rechargeAmount)}
            >
                <Input
                    type="number"
                    value={state.rechargeAmount}
                    onChange={e => setState(prev => ({ ...prev, rechargeAmount: Number(e.target.value) }))}
                    placeholder="请输入要充值的金额"
                />
            </Modal>

            <Modal
                title="购买对话框"
                open={state.showConfirm}
                onCancel={() => setState(prev => ({ ...prev, showConfirm: false }))}
                onOk={() => setState(prev => ({ ...prev, showConfirm: false, showOrder: true }))}
            >
                <span>{`确认是否购买该${columnData.type === 0 ? '专栏' : '小课'}`}</span>
            </Modal>

            <Modal
                title="支付对话框"
                open={state.showOrder && paymentInfo.shouldShow}
                onCancel={() => setState(prev => ({ ...prev, showOrder: false }))}
                onOk={paymentInfo.handleClick}
                okText={paymentInfo.buttonText}
                okButtonProps={{ className: "bg-#45E1B8" }}
            >
                <div className="flex w-full items-center justify-between">
                    <div>{columnData.type === 0 ? "专栏" : "小课"}：{columnData.name}</div>
                    <div>
                        {paymentInfo.timeLimit! >= 999999
                            ? `¥${paymentInfo.price}/永久`
                            : `¥${paymentInfo.price}/${paymentInfo.timeLimit}天`}
                    </div>
                </div>
                <div className="mt-3">
                    <span>余额: ¥{balance}</span>
                    {paymentInfo.needRecharge && (
                        <span className="text-red">（还需充值¥{paymentInfo.rechargeAmount}~😁）</span>
                    )}
                </div>
            </Modal>
        </>
    );
};
interface SearchModalProps {
    isOpen: boolean;
    value: string;
    onOk: () => void;
    onCancel: () => void;
    onChange: (value: string) => void;
}

export const SearchModal = ({
    isOpen,
    value,
    onOk,
    onCancel,
    onChange,
}: SearchModalProps) => {
    return (
        <Modal
            title="搜索您想要搜索的帖子"
            open={isOpen}
            onOk={onOk}
            onCancel={onCancel}
        >
            <Search
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="支持搜索标题和内容"
                size="large"
            />
        </Modal>
    );
};