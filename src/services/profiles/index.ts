import { User } from '../users/entities';
import { request } from '@/utils/request';

export async function getMyProfile(): Promise<User> {
  return await request<User>('/api/v1/profiles/me', {
    method: 'GET',
  });
}
