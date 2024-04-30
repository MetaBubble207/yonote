import React from "react";
import Image from "next/image";

const Column = () => {
    const name = "专栏名称";

    return (
        <div>
            <div className="w-14.5 h-18.75 shrink-0 border-rd-1.25 bg-#fff flex">
                <Image src={"/images/writer/edit/Rectangle 2497.svg"} alt="" width={58} height={75} className="w-14.5 h-18.75 shrink-0 border-rd-1.25"></Image>
                <div className="mt-3">
                    <button>
                        <Image src={"/images/writer/edit/Switch.svg"} alt={""} width={14.09} height={14} className={"w-3.52225 h-3.5 shrink-0 ml-2"}></Image>
                    </button>
                    <div className="w-14.08925 text-[#323232] text-3.5 font-not-italic font-400 lh-6 ml-2 mt-2">
                        {name}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Column;