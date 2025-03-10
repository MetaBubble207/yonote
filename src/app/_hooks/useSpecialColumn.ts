import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';
import useLocalStorage from './useLocalStorage';
import { useColumnSearch } from './useColumnSearch';
import { useAppSelector } from './useRedux';
import { userColumnSelector } from '@/app/_slice/user-column-slice';
import { MessageInstance } from 'antd/es/message/interface';

export const useSpecialColumn = (
  columnId: string,
  messageApi: MessageInstance,
  code?: string,
  invitationCode?: string,
  isBack?: string,
) => {
  const router = useRouter();
  const [token, setToken] = useLocalStorage("token", null);
  const { searchTag } = useAppSelector(userColumnSelector);
  const {
    isDesc,
    searchValue,
    condition,
    isSearching,
    handleSearch,
    toggleSearch,
    toggleSort,
    handleSearchCancel,
    handleSearchChange,
  } = useColumnSearch();

  // API 查询
  const { data: status, isLoading: statusLoading, refetch: refetchUserStatus } = api.order.getUserStatus.useQuery(
    { userId: token, columnId },
    { enabled: Boolean(token) }
  );

  const { data: detailPost, isLoading: detailPostLoading, refetch: refetchColumnOrder } = api.order.getColumnOrder.useQuery(
    { columnId, isDesc, search: condition, tag: searchTag },
    { enabled: Boolean(columnId) }
  );

  const { data: userInfo } = api.users.login.useQuery(
    code!,
    { enabled: Boolean(code && !token) }
  );

  const { data: tags, isLoading: tagsLoading } = api.post.getPostTagsList.useQuery(columnId);

  const createReferral = api.referrals.add.useMutation();

  // 处理登录重定向
  useEffect(() => {
    if (!token && !userInfo && !isBack) {
      const origin = encodeURIComponent(
        `/dashboard/special-column?id=${columnId}&isBack=true${invitationCode ? `&invitationCode=${invitationCode}` : ""}`
      );
      router.push(`/login?origin=${origin}`);
    }
  }, [token, userInfo, isBack, columnId, router, invitationCode]);

  // 处理登录成功
  useEffect(() => {
    if (userInfo && !token) {
      messageApi.success("登录成功！😆，欢迎继续订阅专栏😯~");
      setToken(userInfo.id);
    }
  }, [userInfo, token, setToken]);

  // 处理邀请码
  useEffect(() => {
    if (!invitationCode || !token || !columnId) return;
    createReferral.mutate({
      userId: token,
      referredUserId: invitationCode,
      columnId,
    });
  }, [invitationCode, token, columnId]);

  const refetch = () => {
    refetchUserStatus();
    refetchColumnOrder();
  };
  return {
    status,
    statusLoading,
    detailPost,
    detailPostLoading,
    tags,
    tagsLoading,
    isDesc,
    searchValue,
    condition,
    isSearching,
    handleSearch,
    toggleSearch,
    toggleSort,
    handleSearchCancel,
    handleSearchChange,
    refetch,
  };
};