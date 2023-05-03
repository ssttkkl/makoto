import { Type } from 'class-transformer';
import {
  FileInfo,
  FilePermissionEnum,
  TransformFileInfoArray,
} from '../files/entities';

export class Share {
  shareId: number;

  title: string;

  ownerUid: number;

  @TransformFileInfoArray()
  files?: FileInfo[];

  permission: FilePermissionEnum;

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
