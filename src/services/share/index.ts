import { request } from '@/utils/request';
import { FileInfo, FilePermissionEnum } from '../files/entities';
import { Share } from './entities';

export async function getShareInfo(params: {
  shareId: number;
}): Promise<Share> {
  return await request('/api/v1/share', {
    method: 'GET',
    params,
  });
}

export async function getShareFileInfo(params: {
  shareId: number;
  path?: string;
  depth?: number;
}): Promise<FileInfo[] | FileInfo> {
  return await request('/api/v1/share/files', {
    method: 'GET',
    params,
  });
}

export async function createShare(params: {
  title: string;
  filePath: string[];
  permission: FilePermissionEnum;
  expiresIn: number;
  allowLink: boolean;
}): Promise<Share> {
  return await request('/api/v1/share', {
    method: 'POST',
    data: params,
  });
}

export async function favShare(params: { shareId: number }): Promise<void> {
  return await request('/api/v1/share/fav', {
    method: 'PUT',
    params,
  });
}
export async function unfavShare(params: { shareId: number }): Promise<void> {
  return await request('/api/v1/share/fav', {
    method: 'DELETE',
    params,
  });
}

export async function expireShare(params: { shareId: number }): Promise<void> {
  return await request('/api/v1/share/expired', {
    method: 'PUT',
    params,
  });
}
