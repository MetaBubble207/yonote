import { type PriceListSelect } from "@/server/db/schema";

export interface ReservedProps {
    onClose: () => void;
    check: boolean;
    columnId: string
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