import { Result } from "antd";

const NoData = ({ title, className }: { title?: string, className?: string }) => {
  return <div className={className}>
    <Result title={title || "没有查找到数据噢😯~"} />
  </div>;
};

export default NoData;
