import { type FileDto } from 'src/files/files.dto'

export interface RecycleBinEntityDto {
  entityId: number
  file: FileDto
  path: string
  ctime: Date
}
