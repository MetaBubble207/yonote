// import Image from "next/image";
// import React from "react";
//
// function User() {
//   return (
//     // 背景颜色
//     <div className="bg-gradient-to-rb from-custom-blue via-custom-teal to-custom-light-blue w-screen h-screen">
//       {/* 顶部 */}
//       {/* 用户信息 */}
//       <div className="pl-4 pt-9">
//         <div className="flex flex-row items-center">
//           {/* 用户头像 */}
//           <Image src="/images/user/avatar.svg" alt="avatar" width={83} height={83} className="my-4 ml-4" />
//           <div className="ml-3 flex-1">
//             <div className="flex align-center">
//               <h1 className="w-10 text-[#252525] text-4.5 font-500 lh-6">芋圆</h1>
//
//               {/* 图标 */}
//               <Image src="/images/user/Group.png" alt="group" width={20} height={20} className="ml-2 w-5 h-5 items-center" />
//             </div>
//             <div className="flex items-center">
//               {/* ID */}
//               <div className="logo flex w-3.5 h-3.5 items-center">
//                 <Image src="/images/user/I_logo.svg" alt="group" width={7.44} height={7.44} className="w-1.4775 h-1.86 shrink-0 fill-#666" />
//                 <Image src="/images/user/D_logo.svg" alt="group" width={7.44} height={7.44} className="w-1.4775 h-1.86 shrink-0 fill-#666" />
//               </div>
//               <span className="ml-1 w-18 text-[#999] font-Source Han Sans SC text-2.5 font-not-italic font-400 lh-6 items-center">1317wfa2</span>
//             </div>
//
//           </div>
//
//           {/* 编辑资料 */}
//           <div className="w-19.5 h-5 border-rd-4 bg-[#FFF] text-2.5 font-500 lh-6 rounded-xl flex  bg-white pl-2.5 items-center mr-4">
//             <Image src="/images/user/icon_edit.png" alt="icon" width={14} height={14} className="w-4 h-4 mr-1" />
//             <a href="#" className="w-10 text-[#252525] text-2.5 font-500 lh-6">编辑资料</a>
//           </div>
//         </div>
//       </div>
//
//
//       {/* 专栏、小课区域 */}
//       <div className="w-85.75 h-63.75 border-rd-2.5 bg-#FFF ml-4 pl-4 pt-4 mt-6 ">
//         {/* 导航区域 */}
//         <div className="flex">
//           <a href="#" className="w-7 h-14 mr-8 text-[#B5B5B5] font-source-han-sans-sc text-sm font-normal leading-6">专栏</a>
//           <a href="#" className="w-8 h-14 text-gray-900 font-source-han-sans-sc text-base font-medium leading-6 ">小课</a>
//         </div>
//
//         {/* 内容区域 */}
//         <div className="flex w- h-14">
//           <Image src="/images/user/cover.svg" alt="icon" width={14} height={14} className="w-15.5 h-19" />
//           <div>
//             <h2>「心智与阅读」</h2>
//             <p>情绪价值波动，上上签，愤怒，变化，偏执，创造</p>
//           </div>
//         </div>
//       </div>
//
//
//     </div>
//
//   );
// }
//
//
// export default User;
'use client'
import { useState } from 'react';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, name: 'uiawhdgklhjakhghjifg...', description: '描述文本', checked: true, imgSrc: '/images/image1.png' },
    { id: 2, name: 'nextjs开发', description: 'Next.js 是一个流行的 React 框架', checked: true, imgSrc: '/images/image2.png' },
    { id: 3, name: '维派维客', description: '无数据', checked: false, imgSrc: '/images/image3.png' },
  ]);

  const handleCheckboxChange = (id) => {
    setSubscriptions(prevState =>
        prevState.map(subscription =>
            subscription.id === id ? { ...subscription, checked: !subscription.checked } : subscription
        )
    );
  };

  return (
      <div className="p-5">
        <h1 className="text-xl font-bold mb-4">订阅管理</h1>
        <div className="flex justify-between mb-4">
          <button className="bg-teal-100 text-teal-700 px-4 py-2 rounded">专栏</button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded">小课</button>
          <button className="text-teal-700 px-4 py-2">管理</button>
        </div>
        <ul className="list-none p-0">
          {subscriptions.map(subscription => (
              <li key={subscription.id} className="flex items-center mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                      type="checkbox"
                      checked={subscription.checked}
                      onChange={() => handleCheckboxChange(subscription.id)}
                      className="mr-2"
                  />
                  <img src={subscription.imgSrc} alt={subscription.name} className="w-12 h-12 rounded mr-4" />
                  <div>
                    <h3 className="font-semibold">{subscription.name}</h3>
                    <p className="text-gray-500">{subscription.description}</p>
                  </div>
                </label>
              </li>
          ))}
        </ul>
        <div>
          <h2 className="text-lg font-bold">Selected Options:</h2>
          <ul>
            {subscriptions.map(subscription => (
                subscription.checked && <li key={subscription.id}>{subscription.name}</li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default SubscriptionManagement;

