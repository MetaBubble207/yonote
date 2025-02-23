import { Skeleton } from "antd";

interface LoadingSkeletonProps {
    rows?: number;
    count?: number;
}

export const LoadingSkeleton = ({ rows = 5, count = 3 }: LoadingSkeletonProps) => (
    <>
        {Array.from({ length: count }).map((_, index) => (
            <Skeleton
                key={index}
                active
                paragraph={{ rows }}
                title={false}
                className="w-85.75 h-42.75 border-rd-5 p4 mb-2 bg-[#FFF]"
            />
        ))}
    </>
);