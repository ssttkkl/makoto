import { callLogin, callRefresh } from './api';
import { getRefreshToken, setAccessToken, setRefreshToken } from './token';

export async function login(username: string, password: string): Promise<void> {
  const result = await callLogin({ username, password });
  setAccessToken(result.accessToken);
  setRefreshToken(result.refreshToken);
  console.log('logged in');
}

export async function logout() {
  console.log('logged out');
  setAccessToken(null);
  setRefreshToken(null);
}

export async function refresh(): Promise<boolean> {
  const refToken = getRefreshToken();
  if (refToken) {
    console.log('refreshing token...');
    const token = await callRefresh({ refreshToken: refToken });
    setAccessToken(token.accessToken);
    setRefreshToken(token.refreshToken);
    return true;
  } else {
    return false;
  }
}
