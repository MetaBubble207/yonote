import StoreProvider from "./StoreProvider";
import { TRPCReactProvider } from "@/trpc/react";
import "dayjs/locale/zh-cn";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
export default function Providers({ children }: { children: React.ReactNode }) {
    return <AntdRegistry>
        <TRPCReactProvider>
            <StoreProvider>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#5CE5C1",
                            colorLink: "#B5B5B5",
                            colorLinkActive: "#252525",
                        },
                        components: {
                            Button: {
                                primaryColor: "#252525",
                                colorLinkHover: "#252525",
                                fontWeight: 500,
                            },
                        },
                    }}
                    locale={zhCN}
                >
                    {children}
                </ConfigProvider>
            </StoreProvider>
        </TRPCReactProvider>
    </AntdRegistry>
}   