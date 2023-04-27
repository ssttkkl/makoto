import { Mutex } from 'async-mutex';
import { callLogin, callRefresh } from './api';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './token';

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

// handle 401 or no token
const refreshMutex = new Mutex();

async function refresh(): Promise<boolean> {
  const refToken = getRefreshToken();
  if (refToken) {
    console.log('refreshing token...');
    let token = null;
    try {
      token = await callRefresh({ refreshToken: refToken });
      setAccessToken(token.accessToken);
      setRefreshToken(token.refreshToken);
    } catch (e) {
      console.error('refresh token failed');
      console.error(e);
    }

    if (token?.expiresIn) {
      setTimeout(refresh, token.expiresIn * 0.8 * 1000);
      console.log(`will refresh after ${token.expiresIn * 0.8}s`);
    }
    return true;
  } else {
    return false;
  }
}

export async function refreshExclusive(): Promise<boolean> {
  const accToken = getAccessToken();
  return await refreshMutex.runExclusive(async () => {
    // 获取到锁后，判断token是否已经被之前的请求刷新
    const curAccToken = getAccessToken();
    return accToken !== curAccToken || (await refresh());
  });
}
