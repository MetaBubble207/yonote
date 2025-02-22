"use client";
import React, { useState } from "react";

const AnswerQuestion = () => {
  const options = [
    { text: "这是正确答案", answer: true },
    { text: "这是错误答案1", answer: false },
    { text: "这是错误答案2", answer: false },
    { text: "这是错误答案3", answer: false },
  ];

  const [selectedOption, setSelectedOption] = useState<number>(-1);

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
  };

  return (
    <div className={"pb-50px"}>
      {/*答题*/}
      <div className="mx-16px">
        <div className="text-3.75 font-not-italic font-500 lh-6 mb-16px shrink-0 text-[#252525]">
          题目内容是这个的那我随便打一下，选择题，字数多了你就下去吧...
        </div>
        {/*选项*/}
        {options.map((option, index) => (
          <div
            key={index}
            className={`w-98% h-40px border-rd-1.25 border-1 py-10px mt-8px shrink-0 border-solid border-[#EAF7EE] ${selectedOption === index ? (option.answer ? "bg-[#DAF9F1] text-[#1DB48D]" : "bg-[#ffebec] text-[#f04444]") : "bg-[#ffffff] text-[#b5b5b5]"}`}
            onClick={() => handleOptionClick(index)}
          >
            <div className="font-not-italic font-500 pl-21px shrink-0">
              {option.text}
            </div>
          </div>
        ))}
      </div>
      <div
        className={
          "text-3.5 font-not-italic font-400 lh-[120%] mt-5 text-center text-[#B5B5B5]"
        }
      >
        选择正确后继续阅读
      </div>
    </div>
  );
};

export default AnswerQuestion;
