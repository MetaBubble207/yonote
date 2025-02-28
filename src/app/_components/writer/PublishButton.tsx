import Link from "next/link"

export const PublishButton = ({ columnId, className }: { columnId: string, className?: string }) => {
    return <div className={className}>
        <Link
            href={`/writer/edit?columnId=${columnId}`}
            className="w-20.5 color-[#1db48d] flex h-9 bg-[#dbf9f1]"
        >
            <span className="m-auto">+发布</span>
        </Link>
    </div>
}