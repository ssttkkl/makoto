import User from '@/entities/user';
import { getMyProfile } from '@/services/profiles';
import { useEffect, useState } from 'react';
import * as AuthService from '@/services/auth';

export default () => {
  let [currentUser, setCurrentUser] = useState<User | null>(null);

  const originSetter = setCurrentUser;
  setCurrentUser = (value) => {
    console.log('current profile', value);
    originSetter(value);
  };

  useEffect(() => {
    getMyProfile().then(setCurrentUser).catch(console.error);
  }, []);

  const login = async (username: string, password: string) => {
    const user = await AuthService.login(username, password);
    setCurrentUser(user);
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
