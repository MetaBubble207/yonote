import { type PriceListSelect } from "@/server/db/schema";
import { MessageInstance } from "antd/es/message/interface";

export interface ReservedProps {
    onClose: () => void;
    columnId: string;
    open: boolean;
    messageApi: MessageInstance;
}

export interface PriceItemProps {
    strategy: PriceListSelect;
    isSelected: boolean;
    onSelect: (item: PriceListSelect) => void;
}

export interface ModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

export interface OrderModalProps extends ModalProps {
    columnName: string;
    selectedItem: PriceListSelect;
    balance: number;
    onTopUp: (amount: number) => void;
}