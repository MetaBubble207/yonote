import Payment from "@/app/_components/writer/Payment";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <Payment />
    </Suspense>
  );
};

export default Page;
