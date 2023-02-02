export type FileType = 'document' | 'folder';

export interface FileInfo {
  fid: number;
  filename: string;
  ctime: Date;
  ownerUid: number;
  type: FileType;
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
