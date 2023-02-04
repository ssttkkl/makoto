export type FileType = 'document' | 'folder' | 'link';

export enum FilePermissionEnum {
  None = 0,
  R = 1,
  W = 2,
  X = 4,
  RW = 1 | 2,
  RWX = 1 | 2 | 4,
}

export interface FileInfo {
  fid: number;
  filename: string;
  ctime: Date;
  ownerUid: number;
  type: FileType;
  parentFid: number | null;
}

export interface DocumentInfo extends FileInfo {
  type: 'document';
  mtime: Date;
  atime: Date;
}

export interface FolderInfo extends FileInfo {
  type: 'folder';
  children?: FileInfo[];
}

export interface LinkInfo extends FileInfo {
  type: 'link';
  ref: FileInfo;
  permission: FilePermissionEnum;
}
