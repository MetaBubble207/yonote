import Image from "next/image";

const ResultVip = () => {
  return (
    <div className="h-23 mt-6 flex w-full items-start bg-[#FFF]">
      <div className="flex items-start">
        <Image
          src={"/images/search/cover.svg"}
          alt="cover"
          width={18.2}
          height={24.8}
          className="w-17.25 h-23"
        />
        <div className="flex flex-col pl-3">
          <div className="text-3.75 font-500 lh-6 text-[#252525]">
            「心智与阅读系列：和人家啊已经 是豪丝娜的」
          </div>
          <div className="flex items-center">
            <Image
              src={"/images/search/icon1.svg"}
              alt="icon1"
              width={14}
              height={14}
              className="h-3.5 w-3.5"
            />
            <div className="text-2.75 font-500 lh-6 mr1.25 ml-1 text-[#999]">
              芋圆
            </div>
            <Image
              src={"/images/search/vip.svg"}
              alt="vip"
              width={12}
              height={12}
              className="h-3 w-3"
            />
          </div>
          <div className="text-2.75 font-350 lh-6 text-[#B5B5B5]">
            03.03发布
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResultVip;
