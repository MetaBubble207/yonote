import SpecialColumnBody from "@/app/_components/dashboard/special-column/SpecialColumnBody";
import SpecialColumnHeader from "@/app/_components/dashboard/special-column/SpecialColumnHeader";

const Page = () => {
    return (
        <div className={"w-full bg-[#F5F7FB]"}>
            <div className={"w-full relative"}>
                <div className={"w-full"}>
                    <SpecialColumnHeader></SpecialColumnHeader>
                </div>
                {/*专栏主体*/}
                <div className={"w-full min-h-140 bg-white rounded-t-30px  absolute z-2 top-39"}>
                    <SpecialColumnBody></SpecialColumnBody>
                </div>
            </div>
        </div>
    )
}

export default Page;
