import { User } from '@/services/users/entities';
import { getMyProfile } from '@/services/profiles';
import { useState } from 'react';
import * as AuthService from '@/services/auth';
import useRequest from '@ahooksjs/use-request';
import { getRefreshToken } from '@/services/auth/token';

export default () => {
  let [currentUser, setCurrentUser] = useState<User | null>(null);

  const originSetter = setCurrentUser;
  setCurrentUser = (value) => {
    console.log('current profile', value);
    originSetter(value);
  };

  useRequest(
    async () => {
      try {
        const profile = await getMyProfile();
        setCurrentUser(profile);
      } catch (error) {
        setCurrentUser(null);
        throw error;
      }
    },
    {
      refreshDeps: [getRefreshToken()],
    },
  );

  const login = async (username: string, password: string) => {
    await AuthService.login(username, password);
  };

  const logout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
  };

  return {
    currentUser,
    setCurrentUser,
    login,
    logout,
  };
};
