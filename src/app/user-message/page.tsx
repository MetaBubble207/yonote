import Image from "next/image";

const UserMessage = () => {
    return (
        <div>
            {/*头像*/}
            <Image src={"/images/user/UserAvatar.png"} alt={"头像"} width={"128"} height={"128"}
                   className={"mt-6.75 mx-auto w-16 h-16"}/>

            {/*修改头像*/}
            <div className={"flex items-center w-19.5 h-6 shrink-0 border-rd-4 bg-[#45E1B8] mx-auto pl-2.5"}>
                <Image className={"w-3.477 h-3.477 "} src={"/images/user/Edit.svg"} alt={"头像"} width={"10"}
                       height={"10"}/>
                <button className={"w-10 ml-1.25 text-[#252525] text-2.5 font-500 lh-6"}>修改头像</button>
            </div>

            {/*用户信息*/}
            <div className={"ml-4 mt-11.75"}>
                <div className={"flex"}><p className={"w-14 text-[#252525] text-3.5 font-500 lh-6"}>用户名</p><span className={"pl-15 flex-1  text-3.5 font-400"}>芋圆</span><Image className={"w-3 h-3 shrink-0 mr-3.25"} src={"/images/user/RightArrow.svg"} alt={"RightArrow"} width={"10"} height={"10"}/></div>
                <div className={"mt-5.5 flex"}><p className={"w-14 text-[#252525] text-3.5 font-500 lh-6"}>用户ID</p><span className={"pl-15  text-3.5 font-400"}>1314wfa2</span></div>
                <div className={"mt-5.5 flex"}><p className={"w-14 text-[#252525] text-3.5 font-500 lh-6"}>手机号</p><span className={"pl-15  text-3.5 font-400"}>15293663718</span></div>
            </div>
        </div>


    )
}
export default UserMessage