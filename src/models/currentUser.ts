import { getMyProfile } from '@/services/users';
import * as AuthService from '@/services/auth';
import { useRequest } from '@/utils/request';
import { getRefreshToken } from '@/services/auth/token';
import { User } from '@/services/users/entities';
import { history } from '@umijs/max';

export default () => {
  const { data, loading, refresh } = useRequest(async () => {
    const refToken = getRefreshToken();
    if (refToken) {
      return await getMyProfile();
    } else {
      return undefined;
    }
  });

  const login = async (username: string, password: string) => {
    await AuthService.login(username, password);
    refresh();
  };

  const logout = async () => {
    const username = data?.username;

    await AuthService.logout();
    refresh();
    history.push('/login', { username });
  };

  return {
    currentUser: data as User | undefined,
    loading,
    login,
    logout,
    refresh,
  };
};
