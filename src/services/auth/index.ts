import { Mutex } from 'async-mutex';
import { callLogin, callRefresh } from './api';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './token';
import { history } from '@umijs/max';

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
  let requireLogin = false;

  const refToken = getRefreshToken();
  if (refToken) {
    console.log('refreshing token...');

    const token = await callRefresh({ refreshToken: refToken });

    if (!requireLogin) {
      setAccessToken(token.accessToken);
      setRefreshToken(token.refreshToken);
      console.log('succeed to refresh token');
    }

    if (token?.expiresIn) {
      setTimeout(refresh, token.expiresIn * 0.8 * 1000);
      console.log(`token will be refreshed after ${token.expiresIn * 0.8}s`);
    }
  } else {
    requireLogin = true;
  }

  if (requireLogin) {
    const loc = history.location;
    console.log('invalid refresh token, redirecting to login page...');
    history.push('/login?redirect=' + loc.pathname);
  }

  return !requireLogin;
}

export async function refreshExclusive(): Promise<boolean> {
  console.log('acquiring refresh mutex');
  const accToken = getAccessToken();
  return await refreshMutex.runExclusive(async () => {
    console.log('acquired refresh mutex');
    // 获取到锁后，判断token是否已经被之前的请求刷新
    const curAccToken = getAccessToken();
    return accToken !== curAccToken || (await refresh());
  });
}
