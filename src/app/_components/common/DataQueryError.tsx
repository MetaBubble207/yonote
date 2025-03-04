export const DataQueryError = () => {
    return <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
            <h3 className="text-xl font-semibold">数据加载失败</h3>
            <p className="mt-2 text-gray-500">请刷新页面重试</p>
        </div>
    </div>
}