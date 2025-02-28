import NoData from "@/app/_components/common/NoData";
import Link from "next/link";

export default function Page() {
  return (
    <div className={"text-10 h-subtract-register flex flex-col w-full items-center justify-center"}>
      <NoData title="您还未申请自己的专栏，请先申请后再进行"></NoData>
      <Link href={'/writer/homepage'} className={"text-primary cursor-pointer"}>点击申请</Link>
    </div>
  );
}
