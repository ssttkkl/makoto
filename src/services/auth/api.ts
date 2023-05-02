import { request } from '@/utils/request';
import { RequestConfig } from '@umijs/max';
import Token from './entities';

export async function callLogin(params: {
  username: string;
  password: string;
}): Promise<Token> {
  return await request('/api/v1/auth/login', {
    method: 'POST',
    data: params,
    requireToken: false,
  });
}

export async function callRefresh(params: {
  refreshToken: string;
}): Promise<Token> {
  return await request('/api/v1/auth/refresh', {
    method: 'POST',
    data: params,
    requireToken: false,
  });
}
