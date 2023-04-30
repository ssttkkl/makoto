import { Type } from 'class-transformer';

export class Asset {
  id: number;

  ownerUid: number;

  mimetype: string;

  @Type(() => Date)
  ctime: Date;
}
