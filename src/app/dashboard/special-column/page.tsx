"use client";
import SpecialColumnBody from "@/app/_components/dashboard/special-column/SpecialColumnBody";
import SpecialColumnHeader from "@/app/_components/dashboard/special-column/SpecialColumnHeader";
import withTheme from "@/theme";

const Column = function () {
  return (
    <div className={"w-full bg-[#F5F7FB]"}>
      <div className={"relative w-full"}>
        <div className={"w-full"}>
          <SpecialColumnHeader></SpecialColumnHeader>
        </div>
        {/*专栏主体*/}
        <div
          className={
            "min-h-140 rounded-t-30px z-2 top-39 absolute w-full bg-white"
          }
        >
          <SpecialColumnBody></SpecialColumnBody>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return withTheme(<Column />);
};

export default Page;
