import { api } from "@/trpc/server";
import Loading from "@/app/_components/common/Loading";
import { ArticleContent } from "@/app/_components/dashboard/special-column/post/ArticleContent";
import { LikeSection } from "@/app/_components/dashboard/special-column/post/LikeSection";
import { Navigation } from "@/app/_components/dashboard/special-column/post/Navigation";
import { time2DateString } from "@/tools/timeToString";
import ActionButtons from "@/app/_components/dashboard/special-column/ActionButton";

export default async function Page({ searchParams }: { searchParams: { c: string; id: string } }) {
  const { c, id } = searchParams;
  const chapter = parseInt(c);
  const columnId = id;

  // 服务端数据获取
  const postData = await api.post.getDetailPostById({
    id: columnId,
    chapter,
  });

  if (!postData) {
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
        postData={postData}
        date={postData.createdAt ? time2DateString(postData.createdAt) : ""}
        name={postData.name || ""}
        content={postData.content || ""}
      />

      <LikeSection
        postId={postData.id}
        userId={postData.user.id}
        tags={postData.tag ? postData.tag.split(",") : []}
      />

      <Navigation
        chapter={chapter}
        columnId={columnId}
        columnName={postData.name}
      />
    </div>
  );
}