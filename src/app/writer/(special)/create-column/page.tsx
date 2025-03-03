import { CreateColumnClient } from "@/app/writer/(special)/create-column/components/CreateColumnClient";

export default async function Page({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id } = await searchParams;
  return <CreateColumnClient columnId={id} />;
};

