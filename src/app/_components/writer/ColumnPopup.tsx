import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from "@/trpc/react";

interface CarouselProps {
  images: string[];
  onImageClick: (index: number, column: { id: string; name: string; }) => void;
}

const ColumnPopup: React.FC<CarouselProps> = ({ images, onImageClick }) => {
  const [currentIndices, setCurrentIndices] = useState([0, 1, 2, 3]);
  const [columnData, setColumnData] = useState<{ id: string; name: string; }[]>([]);
  const { data: queryData } = api.column.getAll.useQuery();

  useEffect(() => {
    if (queryData) {
      setColumnData(queryData.map((column: { id: string; name: string; }) => ({ id: column.id, name: column.name })));
    }
  }, [queryData]);

  const goToNextImage = () => {
    setCurrentIndices((prevIndices) => {
      const nextIndices = prevIndices.map((index) => (index + 4) % images.length);
      return nextIndices;
    });
  };

  const goToPrevImage = () => {
    setCurrentIndices((prevIndices) => {
      const updatedIndices = prevIndices.map((index) => (index - 4 + images.length) % images.length);
      return updatedIndices;
    });
  };

  const handleImageClick = (index: number) => {
    onImageClick(index, columnData[index]);
  };

  return (
    <div className='w-213.34 h-94.7 bg-white border-0.5 border-solid border-#D9D9D9 border-rd-2 flex items-center'>
      <button onClick={goToPrevImage} className='ml-6.6'>
        <Image src={'/images/writer/edit/left-c.svg'} alt={'left-c'} width={24} height={24} />
      </button>
      <div className='flex justify-between w-full px-8.2'>
        {currentIndices.map((index) => (
          <button key={index} onClick={() => handleImageClick(index)} className='flex flex-col items-center w-1/4'>
            <img
              src={images[index]}
              alt={`图片${index + 1}`}
              width={160}
              height={51.5}
              className='block'
            />
            <span className='mt-2'>
              {columnData[index]?.name || 'Loading...'}
            </span>
          </button>
        ))}
      </div>
      <button onClick={goToNextImage} className='mr-6.6'>
        <Image src={'/images/writer/edit/right-c.svg'} alt={'right-c'} width={24} height={24} />
      </button>
    </div>
  );
};

export default ColumnPopup;

// import React, {useEffect, useState } from 'react';
// import Image from 'next/image';
// import { api } from "@/trpc/react";


// interface CarouselProps {
//   images: string[];
//   onImageClick: (index: number) => void;
// }

// const ColumnPopup: React.FC<CarouselProps> = ({ images, onImageClick }) => {
//   const [currentIndices, setCurrentIndices] = useState([0, 1, 2, 3]);
//   const [columnName, setColumnName] =useState<string[]>([]);
//   const {data: queryData} = api.column.getAll.useQuery();

//   useEffect(() => {
//     if (queryData) {
//       const names = queryData.map((column: { name: string }) => column.name);
//       setColumnName(names);
//     }
//   }, [queryData]);

//   const goToNextImage = () => {
//     setCurrentIndices((prevIndices) => {
//       const nextIndices = prevIndices.map((index) => (index + 4) % images.length);
//       return nextIndices;
//     });
//   };

//   const goToPrevImage = () => {
//     setCurrentIndices((prevIndices) => {
//       const updatedIndices = prevIndices.map((index) => (index - 4 + images.length) % images.length);
//       return updatedIndices;
//     });
//   };

//   const handleImageClick = (index: number) => {
//     onImageClick(index);
//   };

//   return (
//     <div className='w-213.34 h-94.7 bg-white border-0.5 border-solid border-#D9D9D9 border-rd-2 flex items-center'>
//       <button onClick={goToPrevImage} className='ml-6.6'>
//         <Image src={'/images/writer/edit/left-c.svg'} alt={'left-c'} width={24} height={24} />
//       </button>
//       <div className='flex justify-between w-full px-8.2'>
//         {currentIndices.map((index) => (
//           <button key={index} onClick={() => handleImageClick(index)} className='flex flex-col items-center w-1/4'>
//             <img
//               src={images[index]}
//               alt={`图片${index + 1}`}
//               width={160}
//               height={51.5}
//               className='block'
//             />
//             <span className='mt-2'>
//               {columnName[index]}
//             </span>
            
//           </button>
//         ))}
//       </div>
//       <button onClick={goToNextImage} className='mr-6.6'>
//         <Image src={'/images/writer/edit/right-c.svg'} alt={'right-c'} width={24} height={24} />
//       </button>
//     </div>
//   );
// };

// export default ColumnPopup;



