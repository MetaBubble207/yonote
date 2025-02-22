"use client";
import Image from "next/image";
import { Checkbox, message, Skeleton } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import useLocalStorage from "@/tools/useStore";
import { api } from "@/trpc/react";

// eslint-disable-next-line react/display-name
const ManagementColumn = forwardRef((props: any, ref) => {
  useImperativeHandle(ref, () => ({ handleSave }));
  const [token] = useLocalStorage("token", "");
  const { data: columns, isLoading } =
    api.column.getAlreadySubscribedColumns.useQuery({ userId: token });
  const [columnsState, setColumnsState] = useState(columns);

  const [checkState, setCheckState] = useState(props.manage); // 控制多选框是否可用

  useEffect(() => {
    setCheckState(props.manage);
  }, [props.manage]);

  useEffect(() => {
    setColumnsState(columns);
  }, [columns]);

  const changeVisible = api.order.changeStatusBatch.useMutation();

  const handleSave = () => {
    const req = columnsState.map((item) => ({
      orderId: item.order.id,
      isVisible: item.order.isVisible,
    }));
    changeVisible.mutate({ orders: req });
    message.success("保存成功", 1).then(() => {
      window?.location?.reload();
    });
  };

  const handleChange = (index: number, visible: boolean) => {
    const newColumns = columnsState.map((item, i) => {
      if (index === i) {
        item.order.isVisible = visible;
      }
      return item;
    });
    setColumnsState(newColumns);
  };

  if (isLoading)
    return (
      <>
        <Skeleton
          active
          paragraph={{ rows: 3 }}
          title={false}
          className="w-85.75 h-42.75 border-rd-5 p4 mb-2 bg-[#FFF]"
        />
        <Skeleton
          active
          paragraph={{ rows: 3 }}
          title={false}
          className="w-85.75 h-42.75 border-rd-5 p4 mb-2 bg-[#FFF]"
        />
        <Skeleton
          active
          paragraph={{ rows: 3 }}
          title={false}
          className="w-85.75 h-20.471 bg-#fff rounded-2.5"
        />
        <Skeleton
          active
          paragraph={{ rows: 3 }}
          title={false}
          className="w-85.75 h-20.471 bg-#fff rounded-2.5"
        />
      </>
    );

  return (
    <div className="w-85.75 h-20.471 bg-#fff rounded-2.5 m-auto flex">
      <div className={"w-100% mt-2 flex flex-col"}>
        {columnsState?.map(({ column, order }, index) => (
          <Checkbox
            value={index}
            className={"flex flex-row"}
            key={column.id}
            checked={order.isVisible}
            onChange={(e) => handleChange(index, e.target.checked)}
            disabled={!checkState}
          >
            <div className={"flex"}>
              <Image
                src={column.cover}
                width={100}
                height={100}
                alt={"cover"}
                className="w-11.375 h-15.478 inline-block rounded"
              ></Image>
              <div className="ml-3 mt-3 flex flex-col">
                <div className="text-3 font-500 lh-6 text-[#252525]">
                  {column.name?.length >= 20
                    ? column.name?.substring(0, 20) + "..."
                    : column.name}
                </div>
                <div className="text-2.5 lh-[120%] mt-1 text-[#666]">
                  {column.introduce
                    ? column.introduce?.length >= 50
                      ? column.introduce?.substring(0, 50) + "..."
                      : column.introduce
                    : "该专栏还没有设置简介"}
                </div>
              </div>
            </div>
          </Checkbox>
        ))}
      </div>
    </div>
  );
});

export default ManagementColumn;
