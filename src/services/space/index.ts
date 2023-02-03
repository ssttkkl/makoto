import { request } from '@/utils/request';
import { FileInfo } from '../files/entities';

export async function getFileInfo(params: {
  depth?: number;
  path?: string;
}): Promise<FileInfo> {
  return await request('/api/v1/space', {
    method: 'GET',
    params: params,
  });
}
