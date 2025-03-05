import Image from "next/image";

interface ArticleContentProps {
  title: string;
  content: string;
}

export const ArticleContent = ({ title, content }: ArticleContentProps) => {
  return (
    <>
      <div
        className="h-5.387 text-3.5 font-500 lh-6 mt-9 text-[#333] line-clamp-1">
        {title || "暂无数据"}
      </div>

      <div className="relative mt-4 mr-4">
        <Image
          src={"/images/poster/title2.svg"}
          alt="title2"
          width={2}
          height={2}
          className="w-14.75 h-5.25"
        />
        <div
          className="text-2.5 font-500 lh-6 mt-1.25 text-[#666] line-clamp-6 ml-1"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </>
  );
};