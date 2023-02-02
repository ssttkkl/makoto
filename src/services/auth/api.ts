import { request } from '@/utils/request';
import { User } from '../users/entities';
import Token from './entities';

interface AuthResponseBody {
  token: Token;
  user: User;
}

export async function callLogin(params: {
  username: string;
  password: string;
}): Promise<AuthResponseBody> {
  return await request('/api/v1/auth/login', {
    method: 'POST',
    data: params,
  });
}

export async function callRefresh(params: {
  refreshToken: string;
}): Promise<AuthResponseBody> {
  return await request<AuthResponseBody>('/api/v1/auth/refresh', {
    method: 'POST',
    data: params,
  });
}
