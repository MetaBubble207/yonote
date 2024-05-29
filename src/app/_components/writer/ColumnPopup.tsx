// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { api } from "@/trpc/react";
// import {useRouter, useSearchParams } from 'next/navigation';
// import useLocalStorage from "@/tools/useStore";

// interface CarouselProps {
//   images: string[];
//   onImageClick: (index: number, column: { id: string; name: string; }) => void;
// }

// const ColumnPopup: React.FC<CarouselProps> = ({ images, onImageClick }) => {
//   const [currentIndices, setCurrentIndices] = useState([0, 1, 2, 3]);
//   const [columnData, setColumnData] = useState<{ id: string; name: string; }[]>([]);

//   // const params = useSearchParams();
//   // const userId = params.get("userId");
//   // const { data: queryData } = api.column.getAllByUserId.useQuery({
//   //   userId: userId || ' ',
//   // });


//   const [token] = useLocalStorage("token", null);
//   console.log(token)
//   const columns = api.column.getAllByUserId.useQuery({
//       userId: token
//   }).data;
  
//   const params = useSearchParams();
//   const router = useRouter()

//   useEffect(()=>{
//       const columnId = params.get("columnId");
//       if((!columnId || columnId === "null") && columns){
//           router.push("/writer/homepage?columnId="+columns[0]?.id)
//       }

//   },[columns])






//   // useEffect(() => {
//   //   if (queryData) {
//   //     setColumnData(queryData.map((column: { id: string; name: string; }) => ({ id: column.id, name: column.name })));
//   //   }
//   // }, [queryData]);

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
//     onImageClick(index, columnData[index]);
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
//               {columnData[index]?.name || 'Loading...'}
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
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from "@/trpc/react";
import { useRouter, useSearchParams } from 'next/navigation';
import useLocalStorage from "@/tools/useStore";

interface CarouselProps {
  images: string[];
  onImageClick: (index: number, column: { id: string; name: string; }) => void;
}

const ColumnPopup: React.FC<CarouselProps> = ({ images, onImageClick }) => {
  const [currentIndices, setCurrentIndices] = useState([0, 1, 2, 3]);
  const [columnData, setColumnData] = useState<{ id: string; name: string; }[]>([]);
  
  const [token] = useLocalStorage("token", null);
  const params = useSearchParams();
  const router = useRouter();

  console.log('Token:', token); 

  const { data: columns, isLoading } = api.column.getAllByUserId.useQuery(
    { userId: token || '' },
    { enabled: !!token } 
  );

  console.log('Columns:', columns); // Debug columns

  useEffect(() => {
    const columnId = params.get("columnId");
    if ((!columnId || columnId === "null") && columns?.length) {
      router.push("/writer/homepage?columnId=" + columns[0].id);
    }

    if (columns) {
      setColumnData(columns.map((column: { id: string; name: string; }) => ({ id: column.id, name: column.name })));
    }
  }, [columns, params, router]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              {columnData[index]?.name || ' '}
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


