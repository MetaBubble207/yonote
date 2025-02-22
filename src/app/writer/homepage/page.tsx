"use client";
import React from "react";
import HomepageData from "@/app/_components/writer/homepage/HomepageData";
import Chart from "@/app/_components/writer/homepage/Chart";

const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { columnId: string | undefined };
}) => {
  return (
    <div className="h-full w-full">
      <div className="w-full">
        <HomepageData columnId={searchParams?.columnId} />
      </div>
      <div className="w-full pt-4">
        <Chart columnId={searchParams?.columnId} />
      </div>
    </div>
  );
};

export default Page;
