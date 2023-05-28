import { Type } from 'class-transformer';
import { FileInfo, TransformFileInfo } from '../files/entities';

export class RecycleBinEntity {
  entityId: number;

  @TransformFileInfo()
  file: FileInfo;

  path: string;

  @Type(() => Date)
  ctime: Date;
}
