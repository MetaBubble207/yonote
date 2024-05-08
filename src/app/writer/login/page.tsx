"use client";
import Head from "next/head";
import { useEffect } from "react";
import { Router } from "next/router";

const Login = () => {

  const refreshCode = () => {
    // @ts-ignore
    var obj = new WxLogin({
      self_redirect: true,
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
    script.src = "http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js";
    document.body.appendChild(script);
    script.onload = () => {
      refreshCode();
    }
    window.addEventListener('message',(e)=>{
        console.log(e,"message")
    })


    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* <Head>
        <script src="http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"></script>
      </Head> */}
      <div id="login_container"></div>
    </div>
  );
};

export default Login;
