import Image from "next/image";

interface ArticleContentProps {
  title: string;
  content: string;
}

export const ArticleContent = ({ title, content }: ArticleContentProps) => {
  return (
    <>
      <div
        className="h-5.387 text-3.5 font-500 lh-6 ml-4.5 mx-10 mt-9 text-[#333]"
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title || "暂无数据"}
      </div>

      <div className="w-72.462 h-43.25 ml-4.5 relative mt-4">
        <Image
          src={"/images/poster/title2.svg"}
          alt="title2"
          width={2}
          height={2}
          className="w-14.75 h-5.25"
        />
        <div
          className="w-72.462 h-35 text-2.5 font-500 lh-6 mt-1.25 text-[#666]"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 6,
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </>
  );
};