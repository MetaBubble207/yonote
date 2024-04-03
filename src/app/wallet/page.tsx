
import Image from "next/image"
import React from "react"

const wallet=()=>{
    return(
        <div>
            <div className="flex items-center mt-8 justify-center ">
                <Image src={"/images/wallet/bg.png"} alt={"bg"} width={343} height={164}></Image>
                {/* <div>
                    <div className="w-16 text-[#FFF] text-4 font-not-italic font-400 lh-6 ml-0">
                        账户余额
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default wallet;