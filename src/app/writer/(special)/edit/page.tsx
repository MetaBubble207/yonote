import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { EditorClient } from "./components/EditorClient";
import { validateColumn } from "@/app/_components/common/CheckColumnId";
import { DataQueryError } from "@/app/_components/common/DataQueryError";

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
      const validation = await validateColumn(columnId);
      if (!validation.isValid) {
        return <div className="mt-100">
          {validation.error}
        </div>;
      }
      const columnData = validation.columnData;
      draftData = await api.post.getDraft({ columnId: columnData!.id });
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
    return (
      <DataQueryError />
    );
  }
}