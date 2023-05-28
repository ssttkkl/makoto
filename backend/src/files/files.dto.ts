import { type FilePermissionEnum, type FileType } from '../data/files.entities'

export class FileDto {
  fid: number
  filename: string
  ctime: Date
  ownerUid: number
  type: FileType
}

export class DocumentDto extends FileDto {
  type: 'document'
  mtime: Date
  atime: Date
  lastModifyUserUid: number
}

export class FolderDto extends FileDto {
  type: 'folder'
  children?: FileDto[]
}

export class LinkDto extends FileDto {
  type: 'link'
  ref: FileDto | null
  permission: FilePermissionEnum
}
