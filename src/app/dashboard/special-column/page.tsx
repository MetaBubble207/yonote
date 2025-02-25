import SpecialColumnBody from "@/app/_components/dashboard/special-column/SpecialColumnBody";
import SpecialColumnHeader from "@/app/_components/dashboard/special-column/SpecialColumnHeader";
export interface SpecialColumnBodyProps {
  id: string;
  code?: string;
  invitationCode?: string;
  isBack?: string;
}
export default async function Page({ searchParams }: { searchParams: Promise<SpecialColumnBodyProps> }) {
  const { id, code, invitationCode, isBack } = await searchParams;
  return (
    <div className={"w-full bg-[#F5F7FB]"}>
      <div className={"relative w-full"}>
        <div className={"w-full"}>
          <SpecialColumnHeader columnId={id}></SpecialColumnHeader>
        </div>
        {/*专栏主体*/}
        <div className={"min-h-140 rounded-t-30px z-2 top-39 absolute w-full bg-white"}>
          <SpecialColumnBody columnId={id} code={code} invitationCode={invitationCode} isBack={isBack}></SpecialColumnBody>
        </div>
      </div>
    </div>
  );
};
