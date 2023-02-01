import User from '@/entities/user';
import { callLogin, callRefresh } from './api';
import { getRefreshToken, setAccessToken, setRefreshToken } from './token';

export async function login(username: string, password: string): Promise<User> {
  const result = await callLogin({ username, password });
  setAccessToken(result.token.accessToken);
  setRefreshToken(result.token.refreshToken);
  console.log('logged in');
  return result.user;
}

export async function logout() {
  console.log('logged out');
  setRefreshToken(null);
}

export async function refresh(): Promise<boolean> {
  const refToken = getRefreshToken();
  if (refToken) {
    console.log('refreshing token...');
    const { token } = await callRefresh({ refreshToken: refToken });
    setAccessToken(token.accessToken);
    setRefreshToken(token.refreshToken);
    return true;
  } else {
    return false;
  }
}
