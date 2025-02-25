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
        <SpecialColumnBody columnId={id} code={code} invitationCode={invitationCode} isBack={isBack}></SpecialColumnBody>
      </div>
    </div>
  );
};
