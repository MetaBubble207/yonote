import exp from "constants";
import React from "react";
import Compass from "../compass/page";
import Image from "next/image";
import left_compass from "../left-compass/page";

const edit =() =>{

    return(
        <div>
            {Compass()}
            <div className="w-360 h-197.824 shrink-0 border-rd-[0px_0px_10px_10px] bg-[#FFF] flex">
                <div>
                    {left_compass()}
                </div>
                <div className="inline-flex p-2 items-start gap-2 ml-13.375 mt-8.375">
                    <div>
                        <Image src={"/images/writer/Vector.svg"} alt="Vector" width={16} height={14} className="w-3.75 h-3.28125 shrink-0 fill-#212529 ml-3.625"></Image>
                        <button>

                        </button>
                   </div>
                   <div>
                        <Image src={"/images/writer/Vector.svg"} alt="Vector" width={16} height={14} className="w-3.75 h-3.28125 shrink-0 fill-#212529 ml-2.125 transform scale-x-[-1]"></Image>
                        <button>

                        </button>
                   </div>
                   <div className="text-[#212529] text-3.5 font-not-italic font-400 lh-[140%]  ml-2.5">
                        <select name="font" id="font">
                            <option value="Normal text">Normal text</option>
                        </select>
                   </div>
                   <div className="text-[#212529] text-3.5 font-not-italic font-400 lh-[140%]  ml-2.5">
                        <select name="align" id="align">
                            <option style={{textAlign: 'left'}}>
                                <Image src={"/images/writer/left.svg"} alt="left" width={13} height={15} className=""></Image>
                            </option>
                        </select>
                   </div> 
                </div>
 
            </div> 
        </div>

    );
};

export default edit;