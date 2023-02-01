import Token from '@/entities/token';
import User from '@/entities/user';
import { request } from '@umijs/max';

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface RefreshRequestBody {
  refreshToken: string;
}

export interface AuthResponseBody {
  token: Token;
  user: User;
}

export async function login(body: LoginRequestBody): Promise<AuthResponseBody> {
  return await request<AuthResponseBody>('/api/v1/auth/login', {
    method: 'POST',
    data: body,
  });
}

export async function refresh(
  body: RefreshRequestBody,
): Promise<AuthResponseBody> {
  return await request<AuthResponseBody>('/api/v1/auth/refresh', {
    method: 'POST',
    data: body,
  });
}
