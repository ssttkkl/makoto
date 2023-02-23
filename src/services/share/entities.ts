import { FileInfo } from '../files/entities';
import { User } from '../users/entities';

export interface Share {
  shareId: number;
  title: string;
  owner: User;
  files: FileInfo[];
  permission: number;
  allowLink: boolean;
  ctime: Date;
  etime: Date;
  expired: boolean;
  fav?: boolean;
}

export interface ShareFav {
  ctime: Date;
  share: Share;
}
