"use client";
export default async function Home() {
    if (typeof window !== "undefined") {
        window.location.href = "/writer/homepage";
    }
    return (
        <div></div>
    );
}
