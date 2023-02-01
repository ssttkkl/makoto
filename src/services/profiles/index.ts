import User from '@/entities/user';
import { request } from '@/utils/request';

export async function getMyProfile(): Promise<User> {
  return await request<User>('/api/v1/profiles/me', {
    method: 'GET',
  });
}
