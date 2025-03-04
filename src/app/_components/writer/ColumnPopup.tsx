"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ColumnSelect } from "@/server/db/schema";
import { message } from "antd";
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture";

interface CarouselProps {
  columnId: string | null;
  columns: ColumnSelect[] | [];
  onImageClick: (b: boolean) => void;
}

const ColumnPopup: React.FC<CarouselProps> = ({ columnId, columns, onImageClick }) => {
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if ((!columnId || columnId === "null") && columns?.length) {
      router.push("/writer/homepage?columnId=" + columns[0]!.id);
    }
  }, [columns, columnId, router]);

  useEffect(() => {
    if (columns?.length) {
      setCurrentIndices(columns.slice(0, 4).map((_, index) => index));
    }
  }, [columns]);

  const goToNextImage = () => {
    setCurrentIndices((prevIndices) => {
      const nextIndices = prevIndices.map(
        (index) => (index + 1) % columns.length,
      );
      return nextIndices;
    });
  };

  const goToPrevImage = () => {
    setCurrentIndices((prevIndices) => {
      const updatedIndices = prevIndices.map(
        (index) => (index - 1 + columns.length) % columns.length,
      );
      return updatedIndices;
    });
  };

  const handleImageClick = (index: number) => {
    const selectedColumn = columns[index];
    if (!selectedColumn) {
      messageApi.error("专栏不存在");
      return;
    }
    onImageClick(false);
    router.push("/writer/homepage?columnId=" + selectedColumn.id);
  };

  return (
    <div className="w-213.34 h-94.7 border-0.5 border-#D9D9D9 border-rd-2 flex items-center border-solid bg-white">
      {contextHolder}
      <button
        onClick={goToPrevImage}
        className="ml-6.6"
        disabled={columns.length <= 4}
      >
        <Image
          src={"/images/writer/compass/left-arrow.svg"}
          alt={"left-arrow"}
          width={24}
          height={24}
        />
      </button>
      <div className="px-8.2 flex w-full justify-between">
        {columns.length > 0 ? (
          currentIndices.map((index) => (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              className="flex w-1/4 flex-col items-center"
            >
              <div className="w-160px h-206px relative">
                <Image
                  placeholder="blur"
                  blurDataURL={LoadingImage()}
                  src={columns[index]?.cover ?? NotImage()}
                  alt={`cover${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  quality={100}
                  className="border-rd-2 block"
                />
              </div>

              <span
                className="w-30 mt-2"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {columns[index]?.name || " "}
              </span>
            </button>
          ))
        ) : (
          <div className="text-gray-500">暂无数据哦~</div>
        )}
      </div>
      <button
        onClick={goToNextImage}
        className="mr-6.6"
        disabled={columns.length <= 4}
      >
        <Image
          src={"/images/writer/compass/right-arrow.svg"}
          alt={"right-arrow"}
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

export default ColumnPopup;
