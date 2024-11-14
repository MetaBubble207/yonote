"use client";
import { useEffect } from "react";
import process from "process";

const Login = () => {
  const refreshCode = () => {
    const appid = process.env.NEXT_PUBLIC_QRCODE_APP_ID;

    const originURL = window?.location?.origin;

    const redirect_uri = encodeURIComponent(originURL + '/writer/homepage');
    // @ts-ignore
    const obj = new WxLogin({
      self_redirect: false,
      id: "login_container",
      appid: appid,
      scope: "snsapi_login",
      redirect_uri: redirect_uri,
      state: "state",
      style: "black",
      href: "",
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js";
    document.body.appendChild(script);
    script.onload = () => {
      refreshCode();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F6F6F6] flex items-center justify-center">
      {/* <Head>
        <script src="http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"></script>
      </Head> */}
      <div id="login_container"></div>
    </div>
  );
};

export default Login;
