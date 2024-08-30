"use client";

import React from "react";
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";

const withTheme = (node: JSX.Element) => (
    <>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#5CE5C1',
                    colorLink:'#B5B5B5',
                    colorLinkActive: '#252525'
                },
                components: {
                    Button: {
                        primaryColor: '#252525',
                        colorLinkHover: '#252525',
                        fontWeight: 500,
                    }
                }
            }}
            locale={zhCN}
        >
            {node}
        </ConfigProvider>
    </>
)

export default withTheme;