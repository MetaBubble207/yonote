import React, { useState, useEffect } from "react";
import Image from "next/image";
import ColumnPopup from "./ColumnPopup";
import { api } from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import { useRouter } from 'next/router';

interface ColumnData {
  id: string;
  name: string;
  logo: string;
  createdAt: string; // Assuming API returns createdAt
}

const Column = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [columnName, setColumnName] = useState<string | null>(null);
  const [showColumnPopup, setShowColumnPopup] = useState(false);

  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [token] = useLocalStorage("token", null);

  const { data: columnData, isLoading } = api.column.getAllByUserId.useQuery(
    { userId: token || '' },
    { enabled: !!token } 
  );

  useEffect(() => {
    if (columnData) {
      const filteredAndSortedColumns = columnData
        .filter(column => column.userId === token)
        .map(column => ({
          id: column.id!,
          name: column.name!,
          logo: column.logo!,
          createdAt: column.createdAt!
        }))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      setColumns(filteredAndSortedColumns);
      if (filteredAndSortedColumns.length > 0) {
        setCurrentImage(filteredAndSortedColumns[0].logo);
        setColumnName(filteredAndSortedColumns[0].name);
      }
    }
  }, [columnData, token]);

  const handleImageClick = (index: number, column: ColumnData) => {
    console.log(`Clicked on column: ${column.name}`);
    setCurrentImage(column.logo);
    setColumnName(column.name);
    setShowColumnPopup(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-14.5 h-18.75 shrink-0 border-rd-1.25 bg-#fff flex" onClick={() => setShowColumnPopup(!showColumnPopup)}>
        {currentImage && (
          <Image src={currentImage} alt="" width={58} height={75} className="w-14.5 h-18.75 shrink-0 border-rd-1.25"></Image>
        )}
        <div className="mt-3">
          <button>
            <Image src={"/images/writer/edit/Switch.svg"} alt={""} width={14.09} height={14} className={"w-3.52225 h-3.5 shrink-0 ml-2"}></Image>
          </button>
          <div className="w-14.08925 text-[#323232] text-3.5 font-not-italic font-400 lh-6 ml-2 mt-2">
            {columnName || "专栏名称"}
          </div>
        </div>
      </div>
      <div className="left-308px top-59px absolute">
        {showColumnPopup && <ColumnPopup columns={columns} onImageClick={handleImageClick} />}
      </div>
    </div>
  );
}

export default Column;
