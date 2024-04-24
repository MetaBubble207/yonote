import {Categories} from "@/app/_components/special-column/Categories";
import {Card1} from "@/app/_components/special-column/Card1";
import {Card2} from "@/app/_components/special-column/Card2";


export const Content=()=>{
    return(
        <div>
            {/*四个标签*/}

            <Categories/>

            {/*card1*/}
            <Card1/>
            {/*card2*/}
            <Card2/>
        </div>
    )
}