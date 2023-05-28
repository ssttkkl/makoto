import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { TransactionFor } from 'nest-transact'
import FilesService from 'src/files/files.service'
import { ShareService } from 'src/share/common/share.service'
import { type FilePath } from 'src/utils/path'
import { type Document } from '../../data/document.entities'
import { FilePermissionEnum } from '../../data/files.entities'
import DocumentCommonService from '../common/document.service'

@Injectable()
export default class DocumentFromShareService extends TransactionFor<DocumentFromShareService> {
  constructor (
    private readonly common: DocumentCommonService,
    @Inject(forwardRef(() => FilesService))
    private readonly files: FilesService,
    private readonly shares: ShareService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async get (
    shareId: number,
    path: FilePath
  ): Promise<Document> {
    const share = await this.shares.get(shareId)
    const file = await this.shares.getFile(share, path)
    const unref = await this.files.unref(file, FilePermissionEnum.R)
    return await this.common.getByFid(unref.fid)
  }

  async update (
    uid: number,
    shareId: number,
    path: FilePath,
    data: Buffer
  ): Promise<void> {
    const share = await this.shares.get(shareId)
    const file = await this.shares.getFile(share, path)
    const unref = await this.files.unref(file, FilePermissionEnum.W)
    await this.common.updateByFid(unref.fid, data, uid)
  }
}
