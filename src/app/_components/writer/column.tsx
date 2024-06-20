
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import ColumnPopup from "./ColumnPopup";
// import { api } from "@/trpc/react";
// import useLocalStorage from "@/tools/useStore";
// import { useRouter } from 'next/router';
// import {useSearchParams} from "next/navigation";

// interface ColumnData {
//   id: string;
//   name: string;
//   logo: string;
//   createdAt: string; // Assuming API returns createdAt
// }

// const Column = () => {

//   const params = useSearchParams();
//   const columnId = params.get("columnId");
//   let  currentColumn = api.column.getColumnDetail.useQuery(
//       {columnId:columnId}
//   ).data;
//   const [currentImage, setCurrentImage] = useState<string>(currentColumn?.logo);
//   const [columnName, setColumnName] = useState<string>(currentColumn?.name);
//   const [showColumnPopup, setShowColumnPopup] = useState(false);

//   const [columns, setColumns] = useState<ColumnData[]>([]);
//   const [token] = useLocalStorage("token", null);

//   const { data: columnData, isLoading } = api.column.getAllByUserId.useQuery(
//     { userId: token || '' },
//     { enabled: !!token }
//   );

//   useEffect(() => {
//     if (columnData) {
//       const filteredAndSortedColumns = columnData
//         .filter(column => column.userId === token)
//         .map(column => ({
//           id: column.id,
//           name: column.name,
//           logo: column.logo,
//           createdAt: column.createdAt
//         }))
//         .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

//       setColumns(filteredAndSortedColumns);
//       // if (filteredAndSortedColumns.length > 0) {
//       //   setCurrentImage(filteredAndSortedColumns[0].logo);
//       //   setColumnName(filteredAndSortedColumns[0].name);
//       // }
//     }
//   }, [columnData, token]);

//   const handleImageClick = (index: number, column: ColumnData) => {
//     console.log(`Clicked on column: ${column.name}`);
//     currentColumn.logo = column.logo;
//     currentColumn.name = column.name;
//     setShowColumnPopup(false);
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }


import React, { useState, useEffect } from "react";
import Image from "next/image";
import ColumnPopup from "./ColumnPopup";
import { api } from "@/trpc/react";
import useLocalStorage from "@/tools/useStore";
import { useRouter } from 'next/router';
import { useSearchParams } from "next/navigation";
import Loading from "../common/Loading";

interface ColumnData {
  id: string;
  name: string;
  logo: string;
  createdAt: string; // Assuming API returns createdAt
}

const Column = () => {
  const params = useSearchParams();
  const columnId = params.get("columnId");
  let currentColumn = api.column.getColumnDetail.useQuery(
    { columnId: columnId }
  ).data;
  const [currentImage, setCurrentImage] = useState<string>(currentColumn?.logo);
  const [columnName, setColumnName] = useState<string>(currentColumn?.name);
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
          id: column.id,
          name: column.name,
          logo: column.logo,
          createdAt: column.createdAt
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
    currentColumn.logo = column?.logo;
    currentColumn.name = column?.name;
    setShowColumnPopup(false);
  };

  return (
    <>
      <div className="w-64.77925 shrink-0 border-rd-1.25 bg-#fff flex items-center pl-12.995" onClick={() => setShowColumnPopup(!showColumnPopup)}>
        <div className="relative w-58px h-75px">
          <Image
            placeholder="blur"
blurDataURL={currentColumn?.logo  ?? "/images/user/Loading.svg"}
            src={currentColumn?.logo ?? "/images/user/Loading.svg"}
            alt={"cover"}
            // width={58}
            // height={75}
            objectFit="cover"
            layout="fill"
            quality={100}
            className=" border-rd-2">
          </Image>
        </div>

        <div>
          <button>
            <Image src={"/images/writer/edit/Switch.svg"} alt={""} width={14.09} height={14} className={"w-3.52225 h-3.5 shrink-0 ml-2"}></Image>
          </button>

          <div className="text-[#323232] text-3.5 font-not-italic font-400 ml-2 w-30" style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {currentColumn?.name ? currentColumn?.name : "暂无数据哦~"}
          </div>
        </div>
      </div>
      <div className="left-308px top-59px absolute">
        {showColumnPopup &&
          <div>
            <button className="absolute right-4 top-2" onClick={() => setShowColumnPopup(!showColumnPopup)}>X</button>
            {isLoading ? <Loading /> : <ColumnPopup columns={columns} onImageClick={handleImageClick} />}
          </div>
        }
      </div>
    </>
  );
}

export default Column;
