import React from "react";
import HomepageData from "@/app/_components/writer/homepage/HomepageData";
import Chart from "@/app/_components/writer/homepage/Chart";

export default async function Page({ searchParams }: { searchParams: Promise<{ columnId: string }> }) {
  const columnId = (await searchParams).columnId;
  return (
    <div className="h-full w-full">
      <div className="w-full">
        <HomepageData columnId={columnId} />
      </div>
      <div className="w-full pt-4">
        <Chart columnId={columnId} />
      </div>
    </div>
  );
};
