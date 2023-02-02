import { request } from '@/utils/request';
import { FileInfo, FileType } from './entities';

export async function getFileInfo(params: {
  depth?: number;
  path?: string;
  fid?: number;
}): Promise<FileInfo> {
  return await request('/api/v1/space', {
    method: 'GET',
    params: params,
  });
}

export async function createFile(params: {
  path?: string;
  fid?: number;
  filename: string;
  type: FileType;
}) {
  return await request('/api/v1/space', {
    method: 'POST',
    data: params,
  });
}
