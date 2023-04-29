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

export async function getMyProfile(): Promise<User> {
  return plainToInstance(
    User,
    await request('/api/v1/users/me', {
      method: 'GET',
    }),
  );
}

export async function getProfile(params: { uid: number }): Promise<User> {
  return plainToInstance(
    User,
    await request('/api/v1/users', {
      method: 'GET',
      params,
    }),
  );
}

export async function updateMyProfile(params: {
  nickname: string;
}): Promise<User> {
  return plainToInstance(
    User,
    await request('/api/v1/users/me', {
      method: 'PUT',
      data: params,
    }),
  );
}

export async function updatePassword(params: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> {
  await request('/api/v1/users/me/password', {
    method: 'PUT',
    data: params,
  });
}
