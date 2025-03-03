import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { EditorClient } from "./components/EditorClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ columnId?: string; postId?: string }>;
}) {
  try {
    // 从服务端获取数据
    const { columnId, postId } = await searchParams;

    // 获取文章数据（如果有postId）
    let postData = undefined;
    if (postId) {
      postData = await api.post.getByPostId({ id: parseInt(postId) });
      if (!postData) {
        return notFound();
      }
    }

    // 获取草稿数据（如果没有postId但有columnId）
    let draftData = undefined;
    if (!postId && columnId) {
      draftData = await api.post.getDraft({ columnId });
    }

    return (
      <div className="h-full w-full mt-86px">
        <EditorClient
          initialPostData={postData}
          initialDraftData={draftData}
          initialColumnId={columnId || (postData?.columnId || "")}
        />
      </div>
    );
  } catch (error) {
    console.error("编辑页面加载错误:", error);
    // 返回一个简单的错误UI，避免整个页面崩溃
    return (
      <div className="h-full w-full mt-86px flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500">加载失败</h2>
          <p className="mt-2">请刷新页面重试</p>
        </div>
      </div>
    );
  }
}