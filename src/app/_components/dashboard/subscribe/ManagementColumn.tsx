"use client";
import Image from "next/image";
import { Checkbox, message, Skeleton } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
} from "react";
import useLocalStorage from "@/app/_hooks/useLocalStorage";
import { api } from "@/trpc/react";
import { type ColumnOrder } from "@/server/db/schema";
import DefaultLoadingPicture from "@/utils/DefaultLoadingPicture";
import { LoadingSkeleton } from "../../common/LoadingSkeleton";

interface ManagementColumnProps {
  manage: boolean;
}

interface ManagementColumnRef {
  handleSave: () => void;
}

const MAX_NAME_LENGTH = 20;
const MAX_INTRO_LENGTH = 50;
const LOADING_SKELETON_COUNT = 4;

const ManagementColumn = forwardRef<ManagementColumnRef, ManagementColumnProps>((props, ref) => {
  const [token] = useLocalStorage("token", "");
  const { data: columns, isLoading } = api.column.getAlreadySubscribedColumns.useQuery(
    { userId: token },
    { enabled: Boolean(token) }
  );
  const [columnsState, setColumnsState] = useState<ColumnOrder[]>([]);
  const [checkState, setCheckState] = useState(props.manage);

  const changeVisible = api.order.changeStatusBatch.useMutation({
    onSuccess: () => {
      message.success("保存成功", 1);
      window?.location?.reload();
    }
  });

  useEffect(() => {
    setCheckState(props.manage);
  }, [props.manage]);

  useEffect(() => {
    if (columns) {
      setColumnsState(columns);
    }
  }, [columns]);

  const handleSave = useCallback(() => {
    const req = columnsState.map(item => ({
      orderId: item.order.id,
      isVisible: item.order.isVisible,
    }));
    changeVisible.mutate({ orders: req });
  }, [columnsState, changeVisible]);

  useImperativeHandle(ref, () => ({ handleSave }), [handleSave]);

  const handleChange = useCallback((index: number, visible: boolean) => {
    setColumnsState(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, order: { ...item.order, isVisible: visible } }
          : item
      )
    );
  }, []);

  const truncateText = useCallback((text: string | null | undefined, maxLength: number) => {
    if (!text) return "";
    return text.length >= maxLength ? `${text.substring(0, maxLength)}...` : text;
  }, []);

  if (isLoading) return <LoadingSkeleton count={LOADING_SKELETON_COUNT} />;

  return (
    <div className="w-85.75 h-20.471 bg-#fff rounded-2.5 m-auto flex">
      <div className="w-100% mt-2 flex flex-col">
        {columnsState?.map(({ column, order }, index) => (
          <Checkbox
            key={column.id}
            value={index}
            className="flex flex-row"
            checked={order.isVisible}
            onChange={(e) => handleChange(index, e.target.checked)}
            disabled={!checkState}
          >
            <div className="flex">
              <Image
                src={column.cover ?? DefaultLoadingPicture()}
                width={100}
                height={100}
                alt="cover"
                className="w-11.375 h-15.478 inline-block rounded"
                placeholder="blur"
                blurDataURL={DefaultLoadingPicture()}
              />
              <div className="ml-3 mt-3 flex flex-col">
                <div className="text-3 font-500 lh-6 text-[#252525]">
                  {truncateText(column.name, MAX_NAME_LENGTH)}
                </div>
                <div className="text-2.5 lh-[120%] mt-1 text-[#666]">
                  {column.introduce
                    ? truncateText(column.introduce, MAX_INTRO_LENGTH)
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

ManagementColumn.displayName = "ManagementColumn";

export default ManagementColumn;
