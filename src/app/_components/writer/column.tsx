import React, { useState } from "react";
import Image from "next/image";
import ColumnPopup from "./ColumnPopup";

const Column = () => {
  const images = [
    '/images/writer/edit/Rectangle 2497.svg',
    '/images/writer/edit/Rectangle 2497.svg',
    '/images/writer/edit/Rectangle 2497.svg',
    '/images/writer/edit/Rectangle 2497.svg',
    '/images/writer/edit/Mask group.svg',
    '/images/writer/edit/Mask group.svg',
    '/images/writer/edit/Mask group.svg',
    '/images/writer/edit/Mask group.svg',
    '/images/writer/edit/Rectangle 2497.svg',
    '/images/writer/edit/Rectangle 2497.svg',
    '/images/writer/edit/Rectangle 2497.svg',
    '/images/writer/edit/Rectangle 2497.svg',
    '/images/writer/edit/Mask group.svg',
    '/images/writer/edit/Mask group.svg',
    '/images/writer/edit/Mask group.svg',
    '/images/writer/edit/Mask group.svg',
  ];

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [columnName, setColumnName] = useState("专栏名称");
  const [showColumnPopup, setShowColumnPopup] = useState(false);

  const handleImageClick = (index: number, column: { id: string; name: string; }) => {
    console.log(`Clicked on column: ${column.name}`);
    // Set the column name and corresponding image
    setCurrentImage(images[index]);
    setColumnName(column.name);
    setShowColumnPopup(false);
  };

  return (
    <div>
      <div className="w-14.5 h-18.75 shrink-0 border-rd-1.25 bg-#fff flex" onClick={() => setShowColumnPopup(!showColumnPopup)}>
        <Image src={currentImage} alt="" width={58} height={75} className="w-14.5 h-18.75 shrink-0 border-rd-1.25"></Image>
        <div className="mt-3">
          <button>
            <Image src={"/images/writer/edit/Switch.svg"} alt={""} width={14.09} height={14} className={"w-3.52225 h-3.5 shrink-0 ml-2"}></Image>
          </button>
          <div className="w-14.08925 text-[#323232] text-3.5 font-not-italic font-400 lh-6 ml-2 mt-2">
            {columnName}
          </div>
        </div>
      </div>
      <div className="left-308px top-59px absolute">
        {showColumnPopup && <ColumnPopup images={images} onImageClick={handleImageClick} />}
      </div>
    </div>
  );
}

export default Column;



