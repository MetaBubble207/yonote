import RouteGuard from "../common/RouteGuard";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RouteGuard>{children}</RouteGuard>
    );
}
