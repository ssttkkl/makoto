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
    await request('/api/v1/space/file', {
      method: 'GET',
      params,
    }),
  ) as FileInfo;
}

export async function createSpaceFile(params: {
  path?: string;
  filename: string;
  type: FileType;
}): Promise<DocumentInfo | FolderInfo> {
  return FileInfo.plainToInstance(
    await request('/api/v1/space/file', {
      method: 'POST',
      params: { path: params.path },
      data: params,
    }),
  ) as DocumentInfo | FolderInfo;
}

export async function createSpaceLink(params: {
  path: string;
  shareId: number;
  links: { filename: string; refPath: string }[];
}): Promise<LinkInfo[]> {
  const plain: any[] = await request('/api/v1/space/file/links', {
    method: 'POST',
    params: { path: params.path },
    data: params,
  });
  return plainToInstance(LinkInfo, plain);
}

export async function renameSpaceFile(params: {
  path: string;
  newFilename: string;
}): Promise<FileInfo> {
  return FileInfo.plainToInstance(
    await request('/api/v1/space/file/filename', {
      method: 'PUT',
      params,
    }),
  ) as FileInfo;
}
