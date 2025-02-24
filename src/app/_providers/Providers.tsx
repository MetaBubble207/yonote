import StoreProvider from "./StoreProvider";
import { TRPCReactProvider } from "@/trpc/react";
import "dayjs/locale/zh-cn";
import { AntdRegistry } from "@ant-design/nextjs-registry";
export default function Providers({ children }: { children: React.ReactNode }) {
    return <AntdRegistry>
        <TRPCReactProvider>
            <StoreProvider>
                {children}
            </StoreProvider>
        </TRPCReactProvider>
    </AntdRegistry>
}   