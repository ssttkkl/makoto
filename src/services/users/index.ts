import { request } from '@/utils/request';
import { User } from './entities';

export async function register(params: {
  username: string;
  password: string;
  nickname: string;
}): Promise<User> {
  return await request('/api/v1/users', {
    method: 'POST',
    data: params,
  });
}
