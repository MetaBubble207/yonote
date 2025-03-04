"use client"
import { Modal, Input } from "antd";
import W100H50Modal from "@/app/_components/common/W100H50Modal";
import { ModalProps, OrderModalProps } from "@/app/dashboard/special-column/types";
const { Search } = Input;
export const TopUpModal: React.FC<ModalProps> = ({ onClose, onConfirm }) => (
    <W100H50Modal>
        <div>
            <label htmlFor="amount">输入充值金额</label>
            <input type="text" id="amount" />
        </div>
        <button onClick={onConfirm}>充值</button>
    </W100H50Modal>
);

export const ConfirmPayModal: React.FC<ModalProps> = ({ onClose, onConfirm }) => (
    <W100H50Modal>
        <div>确定是否购买该专栏</div>
        <div className="mt-5 flex space-x-10">
            <button onClick={onConfirm} className="bg-transparent">确认</button>
            <button onClick={onClose} className="bg-transparent">取消</button>
        </div>
    </W100H50Modal>
);

export const OrderModal: React.FC<OrderModalProps> = ({
    onClose,
    onConfirm,
    columnName,
    selectedItem,
    balance,
    onTopUp,
}) => {
    const needTopUp = balance < selectedItem.price;
    const topUpAmount = selectedItem.price - balance;

    return (
        <Modal
            title="确认订单"
            centered
            open={true}
            onCancel={onClose}
            footer={null}
        >
            <div className="mt-6 flex w-full items-center justify-between">
                <div className="h-10 w-40 overflow-scroll">{columnName}</div>
                <div>
                    {selectedItem.timeLimit >= 999999
                        ? `${selectedItem.price}/永久`
                        : `${selectedItem.price}/${selectedItem.timeLimit}天`}
                </div>
            </div>
            <div className="my-6">
                <span>余额: ¥{balance}</span>
                {needTopUp && (
                    <span className="text-red">（还需充值¥{topUpAmount}~😁）</span>
                )}
            </div>
            {needTopUp ? (
                <button
                    className="bg-#45E1B8 w-80"
                    onClick={() => onTopUp(topUpAmount)}
                >
                    充值并支付（¥{topUpAmount}）
                </button>
            ) : (
                <button className="bg-#45E1B8 w-80" onClick={onConfirm}>
                    支付
                </button>
            )}
        </Modal>
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