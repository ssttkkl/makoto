import { request } from '@/utils/request';
import { plainToInstance } from 'class-transformer';
import { RecycleBinEntity } from './entities';

export async function getRecycleBin(): Promise<RecycleBinEntity[]> {
  const plain = (await request('/api/v1/space/recycle-bin', {
    method: 'GET',
  })) as any[];
  return plainToInstance(RecycleBinEntity, plain);
}

export async function moveIntoRecycleBin(params: {
  path: string[];
}): Promise<void> {
  await request('/api/v1/space/recycle-bin', {
    method: 'PUT',
    data: params,
  });
}

export async function moveOutFromRecycleBin(params: {
  entityId: number[];
}): Promise<void> {
  await request('/api/v1/space/recycle-bin/out', {
    method: 'PUT',
    data: params,
  });
}

export async function deleteForever(params: {
  entityId: number[];
}): Promise<void> {
  await request('/api/v1/space/recycle-bin', {
    method: 'DELETE',
    data: params,
  });
}
