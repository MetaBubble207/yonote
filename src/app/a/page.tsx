import {Card, CardClass} from "@/app/_components/Card";

const cards:CardClass[] = [
    {
        img:"/images/img.png",
        title:"开播的第三年",
        name:"芋圆",
        time:"2012-02-02",
        likes:120
    },
    {
        img:"/images/img.png",
        title:"开播的第三年",
        name:"芋圆",
        time:"2012-02-02",
        likes:130
    },
    {
        img:"/images/img.png",
        title:"开播的第三年",
        name:"芋圆",
        time:"2012-02-02",
        likes:140
    },
    {
        img:"/images/img.png",
        title:"开播的第三年",
        name:"芋圆",
        time:"2012-02-02",
        likes:150
    },
    {
        img:"/images/img.png",
        title:"开播的第三年",
        name:"芋圆",
        time:"2012-02-02",
        likes:160
    },
]
const Page = () => {

    return <div className={"space-y-10px"}>
        {cards.map((item,index)=> (
            <Card
                time = {item.time}
                img = {item.img}
                title = {item.title}
                likes={item.likes}
                name = {item.name}
                key={index}
            />
        ))}
    </div>
}

export default Page
