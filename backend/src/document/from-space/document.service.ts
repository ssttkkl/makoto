import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { TransactionFor } from 'nest-transact'
import FilesService from 'src/files/files.service'
import SpaceService from 'src/space/common/space.service'
import { type FilePath } from 'src/utils/path'
import { type Document } from '../../data/document.entities'
import { FilePermissionEnum } from '../../data/files.entities'
import DocumentCommonService from '../common/document.service'

@Injectable()
export default class DocumentFromSpaceService extends TransactionFor<DocumentFromSpaceService> {
  constructor (
    private readonly common: DocumentCommonService,
    @Inject(forwardRef(() => FilesService))
    private readonly files: FilesService,
    private readonly space: SpaceService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async get (
    uid: number,
    path: FilePath
  ): Promise<Document> {
    const file = await this.space.getFile(uid, path, FilePermissionEnum.R)
    const unref = await this.files.unref(file, FilePermissionEnum.R)
    return await this.common.getByFid(unref.fid)
  }

  async update (
    uid: number,
    path: FilePath,
    data: Buffer
  ): Promise<void> {
    const file = await this.space.getFile(uid, path, FilePermissionEnum.W)
    const unref = await this.files.unref(file, FilePermissionEnum.W)
    await this.common.updateByFid(unref.fid, data, uid)
  }
}
