import { Skeleton } from "antd";

interface LoadingSkeletonProps {
    rows?: number;
    count?: number;
    spaceY?: number;
    className?: string;
}

export const LoadingSkeleton = ({ rows = 5, count = 3, spaceY = 2, className }: LoadingSkeletonProps) => (
    <div className={className}>
        {Array.from({ length: count }).map((_, index) => (
            <Skeleton
                key={index}
                active
                paragraph={{ rows }}
                title={false}
                className={`w-85.75 h-${rows*8} border-rd-5 p4 mb-${spaceY} bg-[#FFF]`}
            />
        ))}
    </div>
);