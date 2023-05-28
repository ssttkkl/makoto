import { Injectable } from '@nestjs/common'
import FilesMapperService from 'src/files/mapper.service'
import { type RecycleBinEntityDto } from './recycle-bin.dto'
import { type RecycleBinEntity } from '../../data/recycle-bin.entities'
import { ModuleRef } from '@nestjs/core'
import { TransactionFor } from 'nest-transact'

@Injectable()
export default class RecycleBinMapperService extends TransactionFor<RecycleBinMapperService> {
  constructor (
    private readonly fileMapper: FilesMapperService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async mapDto (entity: RecycleBinEntity): Promise<RecycleBinEntityDto> {
    return {
      entityId: entity.id,
      file: await this.fileMapper.mapDto(await entity.file, 0),
      path: entity.path,
      ctime: entity.ctime
    }
  }
}
