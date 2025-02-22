import Image from "next/image";

const Card = () => {
  return (
    <div className="w-85.75 h-33.75 border-rd-5 bg-[#FFF]">
      <div className="h-19 flex pl-2.5 pt-2">
        <Image
          src={"/images/recommend/cover.svg"}
          alt="cover"
          width={24}
          height={24}
          className="w-15.5 h-19"
        ></Image>
        <div className="w-64.25 ml-3 mt-1 h-16">
          <div className="text-3.75 font-500 lh-6 text-[#252525]">
            「心智与阅读」
          </div>
          <div className="text-3.25 font-400 lh-[120%] mt-2 text-[#666]">
            情绪价值波动，上上签，愤怒，变化，偏执，创造
          </div>
        </div>
      </div>
      <div className="h-9.5 ml-3 mt-3 flex w-full flex-shrink-0 items-center">
        <Image
          src={"/images/subscribe/user1.png"}
          alt="user_image"
          width={24}
          height={24}
          className="w-5.75 h-5.75"
        ></Image>
        <div className="w-43 ml-1">
          <div className="text-2.75 lh-4 flex text-[#999]">芋圆</div>

          <div className="text-2.75 lh-4 text-[#B5B5B5]">03-01发布</div>
        </div>
        <div className="flex flex-1 items-center">
          <Image
            src={"/images/recommend/rss.svg"}
            alt="rss"
            width={5}
            height={5}
            className="w-4.5 h-4.5"
          ></Image>
          <div className="text-2.75 font-500 lh-6 ml-1 text-[#B5B5B5]">
            1.2k
          </div>
          <Image
            src={"/images/recommend/open.svg"}
            alt="open"
            width={5}
            height={5}
            className="w-4.5 h-4.5 ml-7"
          ></Image>
          <div className="text-2.75 font-500 lh-6 ml-1 text-[#B5B5B5]">
            1.2k
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;
