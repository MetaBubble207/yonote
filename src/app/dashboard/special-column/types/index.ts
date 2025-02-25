import { type PriceList } from "@/server/db/schema";

export interface ReservedProps {
    onClose: () => void;
    check: boolean;
}

export interface PriceItemProps {
    strategy: PriceList;
    isSelected: boolean;
    onSelect: (item: PriceList) => void;
}

export interface ModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

export interface OrderModalProps extends ModalProps {
    columnName: string;
    selectedItem: PriceList;
    balance: number;
    onTopUp: (amount: number) => void;
}