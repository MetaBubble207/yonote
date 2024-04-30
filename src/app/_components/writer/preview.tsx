import React from "react";
import Image from "next/image";
import TagInput from "../edit/tag";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig, DomEditor } from '@wangeditor/editor'

interface PreviewProps {
    title: string;
    html: string;
    tags: string[];
}

const Preview = ({ title, html, tags }: PreviewProps) => {

    return (
        <div>
            <div className="w-93 h-144 shrink-0 stroke-0.25 stroke-[#D9D9D9] ml-4.5 b-1 b-#d9d9d9 relative">
                <div className="text-[rgba(0,0,0,0.85)] text-5 font-not-italic font-400 lh-5.5 ml-3.725 mt-3.725 h-10 overflow-auto">
                    <div className="break-all" dangerouslySetInnerHTML={{ __html: title }}></div>
                </div>

                <div className="flex mt-10px items-center space-y-0 mb-22px ml-3.725 mt-4">
                    {/*左边头像*/}
                    <div className={""}>
                        <div>
                            <Image src={"/images/special-column/Ellipse 2.png"} alt={"心智与阅读"} width={33} height={33} />
                        </div>
                    </div>
                    {/*昵称，日期，VIP*/}
                    <div>
                        <div className={"flex items-center"}>
                            <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>芋圆</div>
                            <div>
                                <Image src={"/images/special-column/Group 225.png"} alt={"心智与阅读"} width={12} height={12} className={"lh-0"} style={{ marginLeft: "2.5px" }} />
                            </div>
                        </div>
                        <div className={"text-[#999] text-2.75 font-not-italic font-500 lh-18px ml-5px"}>3.02  12:30发布</div>
                    </div>
                </div>
                <div>
                    <Image src={"/images/special-column/Rectangle 442.png"} alt={"心智与阅读"} width={343} height={161} className="w-85.75 h-40.25 shrink-0 border-rd-5 m-auto" />
                </div>
                <div className={"w-91% mt-24px shrink-0 text-[#666] text-3.5 font-not-italic font-400 lh-[120%] m-auto"}>
                    <div className="h-50 overflow-auto">
                        <div className="break-all h-15" dangerouslySetInnerHTML={{ __html: html }}></div>
                    </div>
                </div>
                <div className="fixed mt-5 ml-3.725 ">
                    {tags.map((tag, index) => (
                        <a key={index} href="" className=" w-15.5 text-[#1DB48D] text-3 font-not-italic font-400 lh-6">#{tag}</a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Preview;