"use client";
import Image from "next/image";
import Navbar from "@/app/_components/common/Navbar";
import Link from "next/link";
import { UserTop } from "@/app/_components/user/UserTop";
import Display from "@/app/_components/user/Display";
import useLocalStorage from "@/tools/useStore";
import { api } from "@/trpc/react";

const Page = () => {
  const logout = () => {
    localStorage.removeItem("token");
  };
  let userInfo;
  const [token] = useLocalStorage("token", null);
  if (token) {
    userInfo = api.users.getOne.useQuery({ id: token }).data;
  }

  // 检测当前用户ID是否有专栏，如果没有，display组件就不渲染
  // const tempID = 'oqWsn6dZt5znIwVE_LrkREZ0NzT4'
  // const ColumnInfo = api.column.getAllByUserId.useQuery({userId:tempID }).data
  const { data: ColumnInfo } = api.column.getAllByUserId.useQuery({
    userId: userInfo?.id,
  });
  // console.log("ColumnInfo======================>",ColumnInfo);
  // console.log("ColumnID=====================>",Column.id);
  // console.log("ColumnId==================>",ColumnId)

  return (
    <div>
      {/* 背景颜色*/}
      <div className="pb-15 px-4 bg-gradient-to-rb from-custom-user_gradient_1 via-custom-user_gradient_2 to-custom-user_gradient_3 w-screen min-h-screen">
        {/* 顶部 */}
        <UserTop />

        {/* 专栏、小课区域 */}

        {ColumnInfo && (
          <>
            {/* 内容区域 */}
            <Display token={token} ColumnInfo={ColumnInfo}></Display>
          </> ) }

        {/*  我的服务模块*/}
        <div
          className={
            "w-full h-51.5 border-rd-2.5 bg-[#FFF] mt-1.5  pt-4.5 mb-3"
          }
        >
          {/*标题*/}
          <h2 className={"text-[#252525] text-3.5 font-500 lh-6 pl-5.5"}>
            我的服务
          </h2>

          <div className="service">
            <ul className={"flex flex-wrap"}>
              <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                <Link
                  href="user/user-detailed"
                  className="flex flex-col items-center"
                >
                  <Image
                    src={"/images/user/HomePage.svg"}
                    alt={"个人主页"}
                    width={"48"}
                    height={"48"}
                    className={"w-6 h-6"}
                  />
                  <p
                    className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}
                  >
                    个人主页
                  </p>
                </Link>
              </li>
              {/*<li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>*/}
              {/*  <Link href="#" className="flex flex-col items-center">*/}
              {/*    <Image*/}
              {/*      src={"/images/user/KnowledgePlanet.svg"}*/}
              {/*      alt={"知识星球"}*/}
              {/*      width={"48"}*/}
              {/*      height={"48"}*/}
              {/*      className={"w-6 h-6"}*/}
              {/*    />*/}
              {/*    <p*/}
              {/*      className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}*/}
              {/*    >*/}
              {/*      知识星球*/}
              {/*    </p>*/}
              {/*  </Link>*/}
              {/*</li>*/}
              <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                <Link
                  href="https://eahu7fmu6k6.feishu.cn/wiki/JtU0wJWhfiBygNkEoCBc2VUIndb?from=from_copylink"
                  className="flex flex-col items-center"
                >
                  <Image
                    src={"/images/user/Usage.svg"}
                    alt={"使用说明"}
                    width={"48"}
                    height={"48"}
                    className={"w-6 h-6"}
                  />
                  <p
                    className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}
                  >
                    使用说明
                  </p>
                </Link>
              </li>
              <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                <Link href="../wallet" className="flex flex-col items-center">
                  <Image
                    src={"/images/user/Income.svg"}
                    alt={"收入提现"}
                    width={"48"}
                    height={"48"}
                    className={"w-6 h-6"}
                  />
                  <p
                    className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}
                  >
                    收入提现
                  </p>
                </Link>
              </li>
              <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                <Link
                  href="https://eahu7fmu6k6.feishu.cn/share/base/form/shrcnM3bJTp21SwwwwAcZ39Q2EL"
                  className="flex flex-col items-center"
                >
                  <Image
                    src={"/images/user/Feedback.svg"}
                    alt={"意见反馈"}
                    width={"48"}
                    height={"48"}
                    className={"w-6 h-6"}
                  />
                  <p
                    className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}
                  >
                    意见反馈
                  </p>
                </Link>
              </li>
              <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                <Link
                  href="https://work.weixin.qq.com/kfid/kfcef6edb33788c7a32"
                  className="flex flex-col items-center"
                >
                  <Image
                    src={"/images/user/Contact.svg"}
                    alt={"联系客服"}
                    width={"48"}
                    height={"48"}
                    className={"w-6 h-6"}
                  />
                  <p
                    className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}
                  >
                    联系客服
                  </p>
                </Link>
              </li>
              <li className={"flex flex-col items-center w-1/4 mt-4.5 mb-2.5"}>
                <Link href="../login" className="flex flex-col items-center">
                  <Image
                    src={"/images/user/SignOut.svg"}
                    alt={"退出登录"}
                    width={"48"}
                    height={"48"}
                    className={"w-6 h-6"}
                  />
                  <p
                    className={"w-11.5 text-[#252525] text-2.75 font-400 lh-6"}
                    onClick={() => logout()}
                  >
                    退出登录
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bottom-4 justify-center w-full fixed">
        <Navbar />
      </div>
    </div>
  );
};

export default Page;
