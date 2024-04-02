import React from "react";
import ReactDOM from "react-dom";
import styles from './index.module.less'

const Model = (props: any) => {
    const { container } = props;

    return ReactDOM.createPortal(
        <div className="w-93.75 h-82.25 shrink-0 border-rd-[20px_20px_0px_0px] bg-[#FFF]">微信登录</div>,
        container
    )
}

const Message = (props: any) => {

}