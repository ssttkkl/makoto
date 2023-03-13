import {
  getAccessToken,
  getRefreshToken,
  tokenEventEmitter,
} from '@/utils/token/holder';
import { useEffect, useState } from 'react';

export function useAccessToken() {
  const [accToken, setAccToken] = useState(getAccessToken());
  useEffect(() => {
    tokenEventEmitter.on('accessToken', setAccToken);
    return () => {
      tokenEventEmitter.off('accessToken', setAccToken);
    };
  }, []);

  return accToken;
}

export function useRefreshToken() {
  const [refToken, setRefToken] = useState(getRefreshToken());
  useEffect(() => {
    tokenEventEmitter.on('refreshToken', setRefToken);
    return () => {
      tokenEventEmitter.off('refreshToken', setRefToken);
    };
  }, []);

  return refToken;
}
