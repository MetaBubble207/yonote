import Image from "next/image";

export interface CardClass {
    img: string,
    title: string,
    name: string,
    time: string,
    likes: number
}
export const Card = (data: CardClass) => {
    const { img, title, name, time, likes } = data
    return (
        <div className={"bg-green p10 rounded-3px border-amber"}>
            <Image placeholder="blur"
blurDataURL={img ?? "/images/user/Loading.svg"}
                src={img} alt={"img"} width={50} height={50} />
            <div>{time}</div>
            <div className={"text-4"}>{title}</div>
            <div>{name}</div>
            <div>{likes}</div>
        </div>
    )
}
