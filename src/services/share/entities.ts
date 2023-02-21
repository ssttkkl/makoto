import { FileInfo } from '../files/entities';

export interface Share {
  shareId: number;
  title: string;
  ownerUid: number;
  files: FileInfo[];
  permission: number;
  allowLink: boolean;
  ctime: Date;
  etime: Date;
}
