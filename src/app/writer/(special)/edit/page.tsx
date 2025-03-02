import { api } from "@/trpc/server";
import MyEditor from "@/app/_components/edit/MyEditor";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ columnId: string; postId?: string }>;
}) {
  // 从服务端获取数据
  const { columnId, postId } = await searchParams;

  // 获取文章数据（如果有postId）
  let postData = undefined;
  if (postId) {
    postData = await api.post.getByPostId({ id: parseInt(postId) });
  }

  // 获取草稿数据（如果没有postId但有columnId）
  let draftData = undefined;
  if (!postId && columnId) {
    draftData = await api.post.getDraft({ columnId });
  }

  return (
    <div className="h-full w-full mt-86px">
      <MyEditor
        initialPostData={postData}
        initialDraftData={draftData}
        initialColumnId={columnId || (postData?.columnId || "")}
        postId={postId ? parseInt(postId) : undefined}
      />
    </div>
  );
}