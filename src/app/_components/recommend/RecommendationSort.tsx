// "use client"
// import React, { useState } from 'react';
//
// export const RecommendationSort = () => {
//     const [activeCategory, setActiveCategory] = useState<string | null>(null);
//
//     const handleCategoryClick = (category:string) => {
//         setActiveCategory(category);
//     };
//
//     const getCategoryStyle = (category:string ) => {
//         if (category === activeCategory) {
//             return {
//                 backgroundColor: 'rgba(69,225,184,0.20)',
//                 color: '#1DB48D'
//             };
//         } else {
//             return {
//                 backgroundColor: '#FFFFFF',
//                 color: '#999'
//             };
//         }
//     };
//
//     return (
//         <div>
//             <div className="flex">
//                 <div
//                     className="h-6 shrink-0 text-center text-[#1DB48D] text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px"
//                     onClick={() => handleCategoryClick("默认")}
//                     style={getCategoryStyle("默认")}
//                 >
//                     默认
//                 </div>
//                 <div
//                     className="h-6 shrink-0 ml-5px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px"
//                     onClick={() => handleCategoryClick("订阅量")}
//                     style={getCategoryStyle("订阅量")}
//                 >
//                     订阅量
//                 </div>
//                 <div
//                     className="h-6 shrink-0 ml-5px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px"
//                     onClick={() => handleCategoryClick("内容量")}
//                     style={getCategoryStyle("内容量")}
//                 >
//                     内容量
//                 </div>
//                 <div
//                     className="h-6 shrink-0 ml-5px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px"
//                     onClick={() => handleCategoryClick("最近发布")}
//                     style={getCategoryStyle("最近发布")}
//                 >
//                     最近发布
//                 </div>
//                 <div
//                     className="h-6 shrink-0 ml-5px text-center text-[#999] text-3.25 font-not-italic font-400 lh-6 border-rd-1 px-9px"
//                     onClick={() => handleCategoryClick("创作时间")}
//                     style={getCategoryStyle("创作时间")}
//                 >
//                     创作时间
//                 </div>
//             </div>
//         </div>
//     );
// };
