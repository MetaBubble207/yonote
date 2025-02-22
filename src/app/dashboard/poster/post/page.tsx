import React from "react";
import Article from "@/app/_components/dashboard/poster/Article";

export default async function Page({ searchParams }: { searchParams: Promise<{ id: string, c: string }> }) {
  const { id, c } = await searchParams;
  return <Article chapter={parseInt(c)} columnId={id} />;
};
