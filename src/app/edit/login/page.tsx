"use client";
import React from "react";
import Compass from "../../_components/writer/Compass";
import Image from "next/image";

const Login = () => {
  return (
    <div className="pt-55.405">
      {Compass()}
      <div className="w-95 h-95 border-rd-2.5 ml-132.5 flex shrink-0 flex-wrap bg-[#FFF]">
        <Image
          src={"/images/writer/image 1.svg"}
          alt={"erweima"}
          width={240}
          height={240}
          className="ml-17.5 mt-14.5725 h-60 w-60 shrink-0"
        ></Image>
        <div className="text-3.5 font-not-italic font-400 lh-6 mt-6.2025 ml-37 text-[#323232]">
          微信扫码登录
        </div>
      </div>
    </div>
  );
};

export default Login;
