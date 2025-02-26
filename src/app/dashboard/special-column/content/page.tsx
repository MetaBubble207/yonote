import { api } from "@/trpc/server";
import Loading from "@/app/_components/common/Loading";
import { ArticleContent } from "@/app/_components/dashboard/special-column/post/ArticleContent";
import { LikeSection } from "@/app/_components/dashboard/special-column/post/LikeSection";
import { Navigation } from "@/app/_components/dashboard/special-column/post/Navigation";
import { time2DateString } from "@/tools/timeToString";
import ActionButtons from "@/app/_components/dashboard/special-column/ActionButton";

export default async function Page({ searchParams }: { searchParams: { c: string; id: string } }) {
  const { c, id } = await searchParams;
  const chapter = parseInt(c);
  const columnId = id;

  // 服务端数据获取
  const postDetailData = await api.post.getDetailPostById({
    id: columnId,
    chapter,
  });

  const postCount = await api.post.getPostCount(columnId);
  if (!postDetailData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-#F5F7FB relative min-h-screen pb-10 pt-4">
      <ActionButtons url={`/dashboard/poster/post?c=${chapter}&id=${columnId}`} />
      <ArticleContent
        postData={postDetailData}
        date={postDetailData.createdAt ? time2DateString(postDetailData.createdAt) : ""}
        name={postDetailData.name || ""}
        content={postDetailData.content || ""}
      />

      <LikeSection
        postId={postDetailData.id}
        userId={postDetailData.user.id}
        tags={postDetailData.tag ? postDetailData.tag.split(",") : []}
      />

      <Navigation
        chapter={chapter}
        columnId={columnId}
        columnName={postDetailData.column.name}
        postCount={postCount}
      />
    </div>
  );
}