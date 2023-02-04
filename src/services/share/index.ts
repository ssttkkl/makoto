import { request } from '@/utils/request';
import { FileInfo } from '../files/entities';
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
