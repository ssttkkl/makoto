import { plainToInstance, Transform, Type } from 'class-transformer';

export type FileType = 'document' | 'folder' | 'link';

export enum FilePermissionEnum {
  None = 0,
  R = 1,
  W = 2,
  X = 4,
  RW = 1 | 2,
  RWX = 1 | 2 | 4,
}

export abstract class FileInfo {
  fid: number;

  filename: string;

  @Type(() => Date)
  ctime: Date;

  ownerUid: number;

  parentFid: number | null;

  static plainToInstance(plain: {
    [key: string]: any;
    type: FileType;
  }): FileInfo {
    switch (plain.type) {
      case 'document':
        /* eslint-disable @typescript-eslint/no-use-before-define */
        return plainToInstance(DocumentInfo, plain);
      case 'folder':
        /* eslint-disable @typescript-eslint/no-use-before-define */
        return plainToInstance(FolderInfo, plain);
      case 'link':
        /* eslint-disable @typescript-eslint/no-use-before-define */
        return plainToInstance(LinkInfo, plain);
    }
  }
}

export function TransformFileInfo() {
  return Transform(({ value }) => FileInfo.plainToInstance(value));
}

export function TransformFileInfoArray() {
  return Transform(({ value }) =>
    value.map((x: any) => FileInfo.plainToInstance(x)),
  );
}

export class DocumentInfo extends FileInfo {
  @Type(() => Date)
  mtime: Date;

  @Type(() => Date)
  atime: Date;
}

export class FolderInfo extends FileInfo {
  @TransformFileInfoArray()
  children?: FileInfo[];
}

export class LinkInfo extends FileInfo {
  @TransformFileInfo()
  ref: FileInfo;

  permission: FilePermissionEnum;
}
