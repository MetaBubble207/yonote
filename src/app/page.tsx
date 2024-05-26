"use client";
export default async function Home() {
  if(typeof window !== "undefined") {
    window.location.href = "/dashboard/find";
  }
  return (
    <div></div>
  );
}

