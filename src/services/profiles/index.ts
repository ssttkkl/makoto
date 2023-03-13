import { User } from '../users/entities';
import { request } from '@/utils/request';
import { plainToInstance } from 'class-transformer';

export async function getMyProfile(): Promise<User> {
  return plainToInstance(
    User,
    await request('/api/v1/profiles/me', {
      method: 'GET',
    }),
  );
}

export async function getProfile(params: { uid: number }): Promise<User> {
  return plainToInstance(
    User,
    await request('/api/v1/profiles', {
      method: 'GET',
      params,
    }),
  );
}
