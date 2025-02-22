import { Result } from "antd";

const NoData = ({ title }: { title: string }) => {
  return <Result title={title || "没有查找到数据噢😯~"} />;
};

export default NoData;
