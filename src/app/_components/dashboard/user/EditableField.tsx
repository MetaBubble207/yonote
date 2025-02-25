import React from 'react';
import Image from "next/image";
interface EditableFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    onEdit: () => void;
    onBlur: () => void;
    onChange: (value: string) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    readOnly?: boolean;
}
export const EditableField = ({
    label,
    value,
    isEditing,
    onEdit,
    onBlur,
    onChange,
    inputRef,
    readOnly,
}: EditableFieldProps) => (
    <div className="flex items-center">
        <p>{label}</p>
        <div className="pl-13 flex flex-1 items-center relative">
            {isEditing ? (
                <input
                    type="text"
                    className="text-3.5 font-400 pl-[15px] w-full"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onBlur();
                        }
                    }}
                    ref={inputRef}
                />
            ) : (
                <>
                    {!readOnly ? (
                        <div className="flex flex-1 items-center cursor-pointer" onClick={onEdit}>
                            <span>{value}</span>
                            <button className="text-2.5 font-500 flex-1 text-right text-[#252525]">
                                <Image
                                    className="absolute top-1 right-0"
                                    src="/images/user/RightArrow.svg"
                                    alt="编辑"
                                    width={12}
                                    height={12}
                                />
                            </button>
                        </div>
                    ) : (
                        <span>{value}</span>
                    )}
                </>
            )}
        </div>
    </div>
);