import { request } from '@/utils/request';
import { FileInfo, FileType } from '../files/entities';

export async function getSpaceFileInfo(params: {
  depth?: number;
  path?: string;
}): Promise<FileInfo> {
  return await request('/api/v1/space', {
    method: 'GET',
    params,
  });
}

export async function createSpaceFile(params: {
  basePath?: string;
  filename: string;
  type: FileType;
}) {
  return await request('/api/v1/space', {
    method: 'POST',
    data: params,
  });
}
