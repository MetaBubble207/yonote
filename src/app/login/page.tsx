"use client"
import React from "react";
import Image from "next/image";
import process from "process";
const Login = () => {
  // const [checked, setChecked] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false); // 用于管理模态框可见性的状态
  // const router = useRouter();
  let checked = false;
  const handleCancel = () => {
    // 处理模态框取消/关闭的函数
    // setModalVisible(false); // 当取消时隐藏模态框
    // router.back();
  };

  // 定义关闭模态框的函数
  // const closeModal = () => {
  //   setModalVisible(false);
  // };

  // const aut1_url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
  const handleLogin = () => {
    if (checked && typeof  window !== "undefined") {
      const appid = process.env.NEXT_PUBLIC_APP_ID;

      const originURL = window?.location?.origin;

      // const redirect_uri = encodeURIComponent(originURL + "/login/callback");
      const redirect_uri = encodeURIComponent(originURL + "/dashboard/user");
      // 跳转到微信认证中心
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&forcePopup=true&state=STATE#wechat_redirect`;
      // setModalVisible(true);
    } else {
      alert("请先勾选同意!");
    }
  };


  return (
    <div>
      <div className="flex justify-center items-center mt-46">
        <Image
          src={"/images/logo.svg"}
          alt={"logo"}
          width={41}
          height={45}
        ></Image>
        <div className="ml-10px">
          <div className={"shrink-0 font-size-5.25 "}>有记</div>
          <div className="shrink-0 font-size-2">YoNote</div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-23.5">
        <button
          className="w-72.25 h-11.5 shrink-0 border-rd-10 bg-[#45E1B8] font-size-3.5"
          onClick={handleLogin}
        >
          微信登录
        </button>
        <button
          className="w-72.25 h-11.5 shrink-0  border-rd-10 border bg-[#fffdfc] mt-3.75 font-size-3.5"
          onClick={handleCancel}
        >
          取消
        </button>
        <div className="flex w-67.75 h-6 mt-8.5575 text-3">
          <input
            type="checkbox"
            // checked={checked}
            onChange={(e) => checked = e.target.checked}
            className="w-5 h-5"
          />
          <div className="ml-1.5">我已阅读并同意《用户协议》和《隐私协议》</div>
        </div>
      </div>
      {/*<div>*/}
      {/*  <GeneralModal isOpen={modalVisible} onClick={closeModal}>*/}
      {/*    /!* 这里放入模态框内部的内容 *!/*/}
      {/*    <div>*/}
      {/*      <Image*/}
      {/*        src={"/images/writer/image 1.svg"}*/}
      {/*        alt={"erweima"}*/}
      {/*        width={240}*/}
      {/*        height={240}*/}
      {/*        className="w-60 h-60 shrink-0 mt-14.5725 m-auto "*/}
      {/*      ></Image>*/}
      {/*    </div>*/}
      {/*  </GeneralModal>*/}
      {/*</div>*/}
    </div>
  );
};
export default Login;
