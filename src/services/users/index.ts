import { request } from '@/utils/request';
import { plainToInstance } from 'class-transformer';
import { User } from './entities';

export async function register(params: {
  username: string;
  password: string;
  nickname: string;
}): Promise<User> {
  return plainToInstance(
    User,
    await request('/api/v1/users', {
      method: 'POST',
      data: params,
      requireToken: false,
    }),
  );
}
