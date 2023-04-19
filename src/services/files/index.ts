import { request } from '@/utils/request';
import { plainToInstance } from 'class-transformer';
import { Share } from '../share/entities';
import { FileInfo, LinkInfo } from './entities';

export async function getFileInfo(params: { fid: number }): Promise<FileInfo> {
  return FileInfo.plainToInstance(
    await request(`/api/v1/files/${params.fid}`, {
      method: 'GET',
    }),
  );
}

export async function getLinksReferencingFile(params: {
  fid: number;
}): Promise<LinkInfo[]> {
  return plainToInstance(
    LinkInfo,
    (await request(`/api/v1/files/${params.fid}/links`, {
      method: 'GET',
    })) as any[],
  );
}

export async function getSharesContainingFile(params: {
  fid: number;
}): Promise<Share[]> {
  return plainToInstance(
    Share,
    (await request(`/api/v1/files/${params.fid}/shares`, {
      method: 'GET',
    })) as any[],
  );
}

export async function setLinkReferencingToNull(params: {
  fid: number;
}): Promise<LinkInfo> {
  return plainToInstance(
    LinkInfo,
    await request(`/api/v1/files/${params.fid}/ref`, {
      method: 'DELETE',
    }),
  );
}
