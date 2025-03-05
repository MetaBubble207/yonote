import { api } from "@/trpc/server";
import Loading from "@/app/_components/common/Loading";
import { ArticleContent } from "@/app/_components/dashboard/special-column/post/ArticleContent";
import { LikeSection } from "@/app/_components/dashboard/special-column/post/LikeSection";
import { Navigation } from "@/app/_components/dashboard/special-column/post/Navigation";
import { time2DateString } from "@/app/_utils/timeToString";
import ActionButtons from "@/app/_components/dashboard/special-column/ActionButton";

export default async function Page({ searchParams }: { searchParams: Promise<{ c: string; id: string }> }) {
  const { c, id } = await searchParams;
  const chapter = parseInt(c);
  const columnId = id;

  const postDetailData = await api.post.getDetailPostById({
    id: columnId,
    chapter,
  });

  const columnData = await api.column.getById(columnId);

  if (!postDetailData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto] gap-10 bg-[#F5F7FB] pb-10 pt-4 w-full overflow-hidden">
      <div>
        <ActionButtons url={`/dashboard/poster/post?c=${chapter}&id=${columnId}`} showSpeedPlanIcon={columnData?.distributorship ?? false} />
        <ArticleContent
          postData={{ ...postDetailData.currentPost, user: postDetailData.user }}
          date={postDetailData.currentPost.createdAt ? time2DateString(postDetailData.currentPost.createdAt) : ""}
          name={postDetailData.currentPost.name || ""}
          content={postDetailData.currentPost.content || ""}
        />
      </div>

      <div className="px-4">
        <LikeSection
          postId={postDetailData.currentPost.id}
          tags={postDetailData.currentPost.tag ? postDetailData.currentPost.tag.split(",") : []}
        />

        <Navigation
          postData={postDetailData}
        />
      </div>
    </div>
  );
}