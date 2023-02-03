import { getMyProfile } from '@/services/profiles';
import * as AuthService from '@/services/auth';
import { useRequest } from '@/utils/request';
import { getRefreshToken } from '@/utils/token';

export default () => {
  const { data, loading, refresh } = useRequest(async () => {
    const refToken = getRefreshToken();
    if (refToken) {
      return await getMyProfile();
    } else {
      return null;
    }
  });

  const login = async (username: string, password: string) => {
    await AuthService.login(username, password);
    refresh();
  };

  const logout = async () => {
    await AuthService.logout();
    refresh();
  };

  return {
    currentUser: data,
    loading,
    login,
    logout,
  };
};
