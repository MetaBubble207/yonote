"use client"
import React,{useState,ChangeEvent} from "react";
import Image from "next/image";

const Payment = () => {
    //button切换
    const[selectedButton, setSelectButton] = useState(1);
    const handleClick = (buttonNumber:number) => {
        setSelectButton(buttonNumber);
        // 清空输入框的值
        setValue1('')
        setValue2('')
        setValue3('')
    }

    // 输入框 1 ：大于等于6
    const [value1, setValue1] = useState('');
    const handleChange1 = (event: ChangeEvent<HTMLInputElement>) => {
        setValue1(event.target.value);
    }

    const handleBlur1 = () => {
        if (parseInt(value1) < 6) {
            setValue1('');
        }
    };
  
    // 输入框 2 ：大于等于10
    const [value2, setValue2] = useState('');
    const handleChange2 = (event: ChangeEvent<HTMLInputElement>) => {
        setValue2(event.target.value);
    }

    const handleBlur2 = () => {
        if (parseInt(value2) < 10) {
            setValue2('');
        }
    };

    // 输入框 3 ：大于等于10
    const [value3, setValue3] = useState('');
    const handleChange3 = (event: ChangeEvent<HTMLInputElement>) => {
        setValue3(event.target.value);
    }

    const handleBlur3 = () => {
        if (parseInt(value3) < 10) {
            setValue3('');
        }
    };




    return <div className="relative w-286.75 h-195 bg-[#FFF] mt-16px ml-18px pt-25.75"> 
        <div className=" w-100 h-48.75 ml-90 mt-20 ">
            <button className="flex items-center h-8" onClick={() => handleClick(1)}>
                {selectedButton === 1 ? (
                    <Image src={"/images/writer/co-author/check.svg"} alt="check" width={20} height={20} className="w-4 h-4 mt-10 ml-8"/>  
                ):(
                    <Image src={"/images/writer/co-author/uncheck.svg"} alt="uncheck" width={20} height={20} className="w-4 h-4 mt-10 ml-8"/>    
                )}        
                <div className="w-8 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5 ml-3 mt-10">30天</div>
                <div className="w-8 text-[rgba(0,0,0,0.85)]  text-3.5 font-400 lh-5.5 ml-4 mt-10 ">价格</div>   
                <div className="w-20 text-[rgba(0,0,0,0.45)] text-3.5 font-400 lh-5 mt-10 ">（最低6元）</div>
                <div className="w-2 text-[rgba(0,0,0,0.85)]  text-3.5 font-400 lh-5.5 mt-10 ">:</div> 
                <div className="inline items-center w-22.06775 h-8 border-rd-1 border-2 border-solid ml-3 mt-10">
                    <input 
                        type="number" 
                        name="value1" 
                        value={value1}
                        onChange={handleChange1} 
                        onBlur={handleBlur1}
                        placeholder="请输入" 
                        className="outline-none w-10.53225 text-[rgba(0,0,0,0.25)] text-3.5 font-400 lh-5.5 mt-1" >
                    </input>
                </div>       
                <div className="w-3.51075 text-[rgba(0,0,0,0.65)] text-right text-3.5 font-400 lh-5.5 ml-2 mt-10">元</div> 
            </button>

            <button className="flex items-center h-8 mt-4" onClick={() => handleClick(2)}>
                {selectedButton === 2 ? (
                    <Image src={"/images/writer/co-author/check.svg"} alt="check" width={20} height={20} className="w-4 h-4 mt-10 ml-8"/>  
                ):(
                    <Image src={"/images/writer/co-author/uncheck.svg"} alt="uncheck" width={20} height={20} className="w-4 h-4 mt-10 ml-8"/>    
                )}      
                <div className="w-8 text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5 ml-3 mt-10">90天</div>
                <div className="w-8 text-[rgba(0,0,0,0.85)]  text-3.5 font-400 lh-5.5 ml-4 mt-10 ">价格</div>   
                <div className="text-[rgba(0,0,0,0.45)] text-3.5 font-400 lh-5 mt-10 ">（最低10元）</div>
                <div className=" text-[rgba(0,0,0,0.85)]  text-3.5 font-400 lh-5.5 mt-10 ">:</div> 
                <div className="inline items-center w-22.06775 h-8 border-rd-1 border-2 border-solid ml-3 mt-10">
                    <input 
                        type="number" 
                        name="value2" 
                        value={value2}
                        onChange={handleChange2}
                        onBlur={handleBlur2}
                        placeholder="请输入" 
                        className="justify-center outline-none w-10.53225 text-[rgba(0,0,0,0.25)] text-3.5 font-400 lh-5.5 mt-1" >    
                    </input>
                </div>       
                <div className="w-3.51075 text-[rgba(0,0,0,0.65)] text-right text-3.5 font-400 lh-5.5 ml-2 mt-10">元</div> 
            </button>

            <button className="flex items-center h-8 mt-4" onClick={() => handleClick(3)}>  
                {selectedButton === 3 ? (
                        <Image src={"/images/writer/co-author/check.svg"} alt="check" width={20} height={20} className="w-4 h-4 mt-10 ml-8"/>  
                    ):(
                        <Image src={"/images/writer/co-author/uncheck.svg"} alt="uncheck" width={20} height={20} className="w-4 h-4 mt-10 ml-8"/>    
                    )}         
                <div className=" text-[rgba(0,0,0,0.65)] text-3.5 font-400 lh-5.5 ml-3 mt-10">365天</div>
                <div className="text-[rgba(0,0,0,0.85)]  text-3.5 font-400 lh-5.5 ml-2.5 mt-10 ">价格</div>   
                <div className="text-[rgba(0,0,0,0.45)] text-3.5 font-400 lh-5 mt-10 ">（最低10元）</div>
                <div className="text-[rgba(0,0,0,0.85)]  text-3.5 font-400 lh-5.5 mt-10 ">:</div> 
                <div className="inline items-center w-22.06775 h-8 border-rd-1 border-2 border-solid ml-4 mt-10">
                    <input 
                        type="number" 
                        name="value3" 
                        value={value3}
                        onChange={handleChange3}
                        onBlur={handleBlur3}
                        placeholder="请输入" 
                        className="justify-center outline-none w-10.53225 text-[rgba(0,0,0,0.25)] text-3.5 font-400 lh-5.5 mt-1" >    
                    </input>
                </div>       
                <div className="w-3.51075 text-[rgba(0,0,0,0.65)] text-right text-3.5 font-400 lh-5.5 ml-2 mt-10">元</div> 
            </button>
        </div>
    </div>
}
export default Payment;