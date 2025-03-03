"use client";
import React, { useState } from "react";
import Image from "next/image";
import ColumnPopup from "./ColumnPopup";
import { api } from "@/trpc/react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import Loading from "@/app/_components/common/Loading";
import { LoadingImage, NotImage } from "@/utils/DefaultPicture";
import { ColumnSelect } from "@/server/db/schema";

const ColumnList = ({ columnId }: { columnId: string | null }) => {
  const { data: currentColumn } = api.column.getColumnDetail.useQuery(columnId!, {
    enabled: Boolean(columnId),
  });
  const [showColumnPopup, setShowColumnPopup] = useState(false);
  const [token] = useLocalStorage("token", null);

  const { data: columns, isLoading } = api.column.getAllByUserId.useQuery(
    { userId: token || "" },
    {
      enabled: !!token,
      select: (data) => data
        .filter(column => column.userId === token)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }
  );

  const handleImageClick = (_: number, column: ColumnSelect) => {
    setShowColumnPopup(false);
  };

  return (
    <>
      <div
        className="w-64.77925 border-rd-1.25 bg-#fff pl-12.995 flex shrink-0 items-center"
        onClick={() => setShowColumnPopup(!showColumnPopup)}
      >
        <div className="w-14.5 h-19 relative">
          <Image
            placeholder="blur"
            blurDataURL={LoadingImage()}
            src={currentColumn?.cover ?? NotImage()}
            alt="cover"
            fill
            loading="lazy"
            quality={100}
            className="rounded-2 object-cover"
          />
        </div>

        <div>
          <button>
            <Image
              src="/images/writer/edit/Switch.svg"
              alt="switch"
              width={14.09}
              height={14}
              className="w-3.52225 ml-2 h-3.5 shrink-0"
            />
          </button>

          <div className="text-3.5 font-not-italic font-400 w-30 ml-2 text-[#323232] truncate">
            {currentColumn?.name || "暂无数据哦~"}
          </div>
        </div>
      </div>

      {showColumnPopup && (
        <div className="left-308px top-59px absolute">
          <div>
            <button
              className="absolute right-4 top-2"
              onClick={() => setShowColumnPopup(false)}
            >
              X
            </button>
            {isLoading ? (
              <Loading />
            ) : (
              <ColumnPopup columnId={columnId} columns={columns || []} onImageClick={handleImageClick} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ColumnList;
