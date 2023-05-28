import { type FileDto } from 'src/files/files.dto'
import { type FilePermissionEnum } from '../../data/files.entities'

export class ShareDto {
  shareId: number
  title: string
  ownerUid: number
  files?: FileDto[]
  permission: FilePermissionEnum
  allowLink: boolean
  ctime: Date
  etime: Date
  expired: boolean
  fav?: boolean
}
