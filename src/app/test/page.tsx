"use client"
import exp from 'constants';
import  QRCode  from 'qrcode.react';



const Test =()=>{
    return(
        <div style={{background:'white', padding:'10px'}}>
            <QRCode
                id="qrCode"
                value="https://baidu.com"
                size={200} // 二维码的大小
                fgColor="#000000" // 二维码的颜色
                
            /> 
        </div>
    )
}
export default Test;
               