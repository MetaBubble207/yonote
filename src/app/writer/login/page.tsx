"use client";
import { useEffect } from "react";

const Login = () => {
  const refreshCode = () => {
    // @ts-ignore
    const obj = new WxLogin({
      self_redirect: false,
      id: "login_container",
      appid: "wx6e3b77c29681a56b",
      scope: "snsapi_login",
      redirect_uri: "https://app.yonote.net/login/callback",
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
