import { SortLabel } from "@/app/_components/special-column/SortLabel";
import { SpecialColumnCard } from "@/app/_components/special-column/SpecialColumnCard";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";


export const SpecialColumnList = (props) => {
    const status = props.data;

    return (
        <div>
            <SortLabel data={status} />
        </div>
    )
}
