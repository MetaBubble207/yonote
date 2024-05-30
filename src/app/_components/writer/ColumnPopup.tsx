import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

interface Column {
  id: string;
  name: string;
  logo: string;
  createdAt: string;
}

interface CarouselProps {
  columns: Column[];
  onImageClick: (index: number, column: Column) => void;
}

const ColumnPopup: React.FC<CarouselProps> = ({ columns, onImageClick }) => {
  const [currentIndices, setCurrentIndices] = useState([0, 1, 2, 3]);

  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const columnId = params.get("columnId");
    if ((!columnId || columnId === "null") && columns.length) {
      router.push("/writer/homepage?columnId=" + columns[0].id);
    }
  }, [columns, params, router]);

  const goToNextImage = () => {
    setCurrentIndices((prevIndices) => {
      const nextIndices = prevIndices.map((index) => (index + 4) % columns.length);
      return nextIndices;
    });
  };

  const goToPrevImage = () => {
    setCurrentIndices((prevIndices) => {
      const updatedIndices = prevIndices.map((index) => (index - 4 + columns.length) % columns.length);
      return updatedIndices;
    });
  };

  const handleImageClick = (index: number) => {
    onImageClick(index, columns[index]);
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
              src={columns[index]?.logo}
              alt={`无图片`}
              width={160}
              height={51.5}
              className='block'
            />
            <span className='mt-2'>
              {columns[index]?.name || ' '}
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



