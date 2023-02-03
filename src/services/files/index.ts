import { request } from '@/utils/request';
import { FileType } from './entities';

export async function createFile(params: {
  parentFid?: number;
  filename: string;
  type: FileType;
}) {
  return await request('/api/v1/files', {
    method: 'POST',
    data: params,
  });
}
