import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { PostPoster } from "@/app/_components/dashboard/poster/PostPoster";

export default async function Page({
  searchParams
}: {
  searchParams: { id: string; c: string; }
}) {
  const { id: columnId, c } = await searchParams;
  const chapter = parseInt(c);
  const postData = await api.post.getDetailPostById({ id: columnId, chapter });
  if (!postData) {
    redirect("/404");
  }

  const [user, likeCount, readCount] = await Promise.all([
    api.users.getOneByColumnId(columnId),
    api.like.getLikeCount({ postId: postData.id }),
    api.read.getPostRead({ postId: postData.id })
  ]);

  if (!user) {
    redirect("/404");
  }

  return (
    <PostPoster user={user} postData={postData} columnId={columnId} chapter={chapter} likeCount={likeCount} readCount={readCount} />
  );
}