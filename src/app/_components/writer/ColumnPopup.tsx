// import React, { useState } from 'react';
// import Image from 'next/image';

// interface CarouselProps {
//   images: string[];
//   onImageClick: (index: number) => void;
// }

// const ColumnPopup: React.FC<CarouselProps> = ({ images, onImageClick }) => {
//   const [currentIndices, setCurrentIndices] = useState([0, 1, 2, 3]);

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

// //   return (
// //     <div className='w-213.34 h-94.7 bg-white border-0.5 border-solid border-#D9D9D9 border-rd-2 flex items-center'>
// //       <button onClick={goToPrevImage} className='ml-6.6'>
// //         <Image src={'/images/writer/edit/left-c.svg'} alt={'left-c'} width={24} height={24}></Image>
// //       </button>
// //       <div className='flex w-172 h-51.5 overflow-hidden ml-8.2 mr-8.2 '>
// //         {images.map((image, index) => (
          
// //             <button  key={index} onClick={() => handleImageClick(index)}>
// //               <img
// //                 src={image}
// //                 alt={`图片${index + 1}`}
// //                 width={160}
// //                 height={51.5}
// //                 className={currentIndices.includes(index) ? 'block mr-4 ' : 'hidden mr-4 '}
// //               />
// //               <span className='mt-2'>专栏名称</span>
// //             </button>

// //         ))}
// //       </div>


// //       <button onClick={goToNextImage}>
// //         <Image src={'/images/writer/edit/right-c.svg'} alt={'right-c'} width={24} height={24}></Image>
// //       </button>
// //     </div>
// //   );
// // };
// export default ColumnPopup;

//在图片下面增加“专栏名称”
import React, { useState } from 'react';
import Image from 'next/image';

interface CarouselProps {
  images: string[];
  onImageClick: (index: number) => void;
}

const ColumnPopup: React.FC<CarouselProps> = ({ images, onImageClick }) => {
  const [currentIndices, setCurrentIndices] = useState([0, 1, 2, 3]);

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
    onImageClick(index);
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
            <span className='mt-2'>专栏名称</span>
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
