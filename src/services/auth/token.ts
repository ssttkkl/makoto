let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

export function setAccessToken(newToken: string | null) {
  accessToken = newToken;
  console.debug('new accessToken set');
}

export function setRefreshToken(newToken: string | null) {
  if (newToken) {
    localStorage.setItem('refreshToken', newToken);
    console.debug('new refreshToken was set');
  } else {
    localStorage.removeItem('refreshToken');
    console.debug('refreshToken was removed');
  }
}
