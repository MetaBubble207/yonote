import { ColumnSelect } from "@/server/db/schema"
import { LoadingImage, NotImage } from "@/app/_utils/DefaultPicture"
import Image from "next/image"
export const ColumnContent = ({ column }: { column: ColumnSelect }) => {
    return <div className="w-full ml-1 mt-10 flex-1">
        <div className="line-clamp-1 text-sm w-80">
            {column.name}
        </div>
        <Image
            src={"/images/poster/title1.svg"}
            alt="title1"
            width={2}
            height={2}
            className="w-14.75 h-5.25 mt-4"
        />
        <div className="mt-1 flex items-center justify-center">
            <div className="w-23 relative h-29">
                <Image
                    placeholder="blur"
                    blurDataURL={LoadingImage()}
                    src={column.cover ?? NotImage()}
                    alt="cover"
                    quality={100}
                    fill
                    loading="lazy"
                    className="rounded object-cover"
                />
            </div>
            {/* 简介内容 */}
            <div
                className="w-full text-2.5 font-medium leading-6 mx-2.75 m mt-2 text-[#666] line-clamp-6"
            >
                {column.introduce}
            </div>
        </div>
    </div>
}