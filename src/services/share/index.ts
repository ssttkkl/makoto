import { request } from '@/utils/request';
import { plainToInstance } from 'class-transformer';
import { FileInfo, FilePermissionEnum } from '../files/entities';
import { Share, ShareFav } from './entities';

export async function getShareInfo(params: {
  shareId: number;
}): Promise<Share> {
  return plainToInstance(
    Share,
    await request('/api/v1/share', {
      method: 'GET',
      params,
      requireToken: false,
    }),
  );
}

export async function getShareFileInfo(params: {
  shareId: number;
  path?: string;
  depth?: number;
}): Promise<FileInfo> {
  return FileInfo.plainToInstance(
    await request('/api/v1/share/files', {
      method: 'GET',
      params,
      requireToken: false,
    }),
  );
}

export async function createShare(params: {
  title: string;
  filePath: string[];
  permission: FilePermissionEnum;
  expiresIn: number;
  allowLink: boolean;
}): Promise<Share> {
  return plainToInstance(
    Share,
    await request('/api/v1/share', {
      method: 'POST',
      data: params,
    }),
  );
}

export async function getOwnShares(): Promise<Share[]> {
  return plainToInstance(
    Share,
    (await request('/api/v1/share/own', {
      method: 'GET',
    })) as any[],
  );
}

export async function getFavShares(
  params: { excludeExpired?: boolean } = {},
): Promise<ShareFav[]> {
  return plainToInstance(
    ShareFav,
    (await request('/api/v1/share/fav', {
      method: 'GET',
      params,
    })) as any[],
  );
}

export async function favShare(params: { shareId: number }): Promise<void> {
  await request('/api/v1/share/fav', {
    method: 'PUT',
    params,
  });
}

export async function unfavShare(params: { shareId: number }): Promise<void> {
  await request('/api/v1/share/fav', {
    method: 'DELETE',
    params,
  });
}

export async function expireShare(params: { shareId: number }): Promise<void> {
  await request('/api/v1/share/expired', {
    method: 'PUT',
    params,
  });
}

export async function getRecentShares(
  params: { excludeExpired?: boolean } = {},
): Promise<Share[]> {
  return plainToInstance(
    Share,
    (await request('/api/v1/share/access-record', {
      method: 'GET',
      params,
    })) as any[],
  );
}

export async function putShareAccessRecord(params: {
  shareId: number;
}): Promise<void> {
  await request('/api/v1/share/access-record', {
    method: 'PUT',
    params,
  });
}
