import { Column } from "@/server/db/schema"
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture"
import Image from "next/image"
export const ColumnContent = ({ column }: { column: Column }) => {
    return <div className="w-73 h-44.5 ml-4.5 mt-4" >
        <Image
            src={"/images/poster/title1.svg"}
            alt="title1"
            width={2}
            height={2}
            className="w-14.75 h-5.25"
        />
        <div className="mt-3.375 flex items-center justify-center">
            <div className="w-25 relative h-32">
                <Image
                    placeholder="blur"
                    blurDataURL={DefaultLoadingPicture()}
                    src={column?.cover ?? DefaultLoadingPicture()}
                    alt="cover"
                    quality={100}
                    fill
                    loading="lazy"
                    className="rounded object-cover"
                />
            </div>
            {/* 简介内容 */}
            <div
                className="w-44.744 h-35 text-2.5 font-500 lh-6 ml-2.75 mt-2 text-[#666]"
                style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-flex",
                    WebkitLineClamp: 6,
                }}
            >
                {column.introduce}
            </div>
        </div>
    </div>
}