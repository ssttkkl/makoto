import { Type } from 'class-transformer';
import { FileInfo, TransformFileInfoArray } from '../files/entities';
import { User } from '../users/entities';

export class Share {
  shareId: number;

  title: string;

  owner: User;

  @TransformFileInfoArray()
  files?: FileInfo[];

  permission: number;

  allowLink: boolean;

  @Type(() => Date)
  ctime: Date;

  @Type(() => Date)
  etime: Date;

  expired: boolean;

  fav?: boolean;
}

export class ShareFav {
  @Type(() => Date)
  ctime: Date;

  @Type(() => Share)
  share: Share;
}
