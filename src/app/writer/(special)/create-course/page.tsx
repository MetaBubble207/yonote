import { CreateCourseClient } from "./components/CreateCourseClient";

export default async function Page({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id } = await searchParams;
  return <CreateCourseClient columnId={id} />;
};


