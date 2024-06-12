"use client"
import Image from "next/image"
import { Checkbox } from 'antd';
import {useEffect, useState} from "react";


const ManagementClass = (props) => {
    const [array, setArray] = useState([]);
    const [checkSate, setCheckSate] = useState(props.manage); // 控制多选框是否可用

    const outputValue = (checkedValues) => {
        console.log('checked values:', checkedValues);
        setArray(checkedValues);
    };
    
    useEffect(()=>{  
        console.log('selectedOptions:', array);
    }, [array])
    
    useEffect(()=>{
        if(props.manage === false){
            setCheckSate(false);
        }else{
            setCheckSate(true);
        }
    })
    
    return (
        <div className="w-85.75 h-20.471 bg-#fff m-auto border-rd-2.5 flex">
            <div className={"m-auto"}>
                还没有数据哦~
                    {/*<div className={"flex flex-col"}>*/}
                    {/*    <Checkbox.Group onChange={outputValue} disabled={!checkSate}>*/}
                    {/*    <Checkbox value={1}>*/}
                    {/*        <div className={"flex"}>*/}
                    {/*            <Image src={"/images/subscribe/cover.png"} width={100} height={100} alt={"cover"} className="w-11.375 h-15.478"></Image>*/}
                    {/*            <div className="ml-3 mt-3 flex-1">*/}
                    {/*                <h3 className="text-[#252525] text-3 font-500 lh-6">「小课不够的话开播的第3年，P人沉...」</h3>*/}
                    {/*                <h4 className="text-[#666] text-2.5 lh-[120%] mt-1">显示多少然后开始了...</h4>*/}
                    {/*            </div> */}
                    {/*        </div>*/}
                    {/*    </Checkbox>*/}
                    {/*    </Checkbox.Group>*/}
                    {/*</div>*/}

            </div>
        </div>
    )

}

export default ManagementClass;
