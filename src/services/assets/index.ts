import { request } from '@/utils/request';
import { plainToInstance } from 'class-transformer';
import { Asset } from './entities';

export async function getAssetMeta(params: {
  assetId: number;
}): Promise<Asset> {
  return plainToInstance(
    Asset,
    await request(`/api/v1/assets/meta`, {
      method: 'GET',
      params,
    }),
  );
}

export async function getAsset(params: {
  assetId: number;
}): Promise<ArrayBuffer> {
  return await request(`/api/v1/assets`, {
    method: 'GET',
    params,
    responseType: 'arraybuffer',
  });
}
