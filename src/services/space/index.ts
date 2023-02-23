import { request } from '@/utils/request';
import { plainToInstance } from 'class-transformer';
import {
  DocumentInfo,
  FileInfo,
  FileType,
  FolderInfo,
  LinkInfo,
} from '../files/entities';

export async function getSpaceFileInfo(params: {
  depth?: number;
  path?: string;
}): Promise<FileInfo> {
  return FileInfo.plainToInstance(
    await request('/api/v1/space', {
      method: 'GET',
      params,
    }),
  );
}

export async function createSpaceFile(params: {
  basePath?: string;
  filename: string;
  type: FileType;
}): Promise<DocumentInfo | FolderInfo> {
  return FileInfo.plainToInstance(
    await request('/api/v1/space', {
      method: 'POST',
      data: params,
    }),
  );
}

export async function createSpaceLink(params: {
  basePath: string;
  shareId: number;
  links: { filename: string; refPath: string }[];
}): Promise<LinkInfo[]> {
  const plain: any[] = await request('/api/v1/space/link', {
    method: 'POST',
    data: params,
  });
  return plainToInstance(LinkInfo, plain);
}
