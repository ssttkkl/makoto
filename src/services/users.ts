import User from '@/entities/user';
import { request } from '@umijs/max';

export interface RegisterRequestBody {
  username: string;
  password: string;
  nickname: string;
}

export type RegisterResponseBody = User;

export async function register(
  body: RegisterRequestBody,
): Promise<RegisterResponseBody> {
  return await request<RegisterResponseBody>('/api/v1/users', {
    method: 'POST',
    data: body,
  });
}
