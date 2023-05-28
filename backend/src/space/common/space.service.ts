import { forwardRef, Inject, Injectable } from '@nestjs/common'
import FilesService from '../../files/files.service'
import { File, type FileLink, FilePermissionEnum, type FileType } from '../../data/files.entities'
import { FileNotFoundException } from '../../files/files.exception'
import { ShareService } from 'src/share/common/share.service'
import { type FilePath } from 'src/utils/path'
import { ShareOperationForbiddenException } from 'src/share/common/share.exception'
import { IsNull, Repository } from 'typeorm'
import { TransactionFor } from 'nest-transact'
import { ModuleRef } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export default class SpaceService extends TransactionFor<SpaceService> {
  constructor (
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
    @Inject(forwardRef(() => FilesService))
    private readonly files: FilesService,
    @Inject(forwardRef(() => ShareService))
    private readonly shares: ShareService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async getSpaceRoot (uid: number): Promise<File> {
    const root = await this.filesRepository.findOne({
      where: {
        uid,
        parent: IsNull()
      }
    })

    if (root !== null) {
      return root
    } else {
      return await this.files.createChild({
        uid,
        filename: '',
        type: 'folder'
      })
    }
  }

  async getFile (uid: number, path: FilePath, ensurePermission?: FilePermissionEnum): Promise<File> {
    const root = await this.getSpaceRoot(uid)
    const file = await this.files.navigateTo(root, path, ensurePermission)
    if (file === null) {
      throw new FileNotFoundException()
    }
    return file
  }

  async createFile (uid: number, params: {
    basePath: FilePath
    filename: string
    type: FileType
  }): Promise<File> {
    const parent = await this.getFile(uid, params.basePath, FilePermissionEnum.W)
    const child = await this.files.createChild({
      uid,
      parent,
      filename: params.filename,
      type: params.type
    })
    return child
  }

  async createLink (uid: number, params: {
    basePath: FilePath
    shareId: number
    links: Array<{ filename: string, refPath: FilePath }>
  }): Promise<FileLink[]> {
    const parent = await this.getFile(uid, params.basePath, FilePermissionEnum.W)
    const share = await this.shares.get(params.shareId)
    if (!share.allowLink) {
      throw new ShareOperationForbiddenException()
    }

    const pairs: FileLink[] = []

    for (const { filename, refPath } of params.links) {
      const ref = await this.shares.getFile(share, refPath)
      pairs.push(
        await this.files.createLink({
          uid,
          filename,
          parent,
          refFid: ref.fid,
          permission: share.permission
        })
      )
    }

    return pairs
  }

  async renameFile (uid: number, params: {
    basePath: FilePath
    oldFilename: string
    newFilename: string
  }): Promise<File> {
    const parent = await this.getFile(uid, params.basePath, FilePermissionEnum.W)
    return await this.files.renameFile(parent, params.oldFilename, params.newFilename)
  }

  async moveFile (uid: number, params: {
    basePath: FilePath
    filename: string
    destPath: FilePath
  }): Promise<File> {
    const root = await this.getFile(uid, params.basePath, FilePermissionEnum.W)
    const dest = await this.getFile(uid, params.destPath, FilePermissionEnum.W)
    return await this.files.moveFile(root, params.filename, dest)
  }

  async copyFile (uid: number, params: {
    basePath: FilePath
    filename: string
    destPath: FilePath
  }): Promise<File> {
    const root = await this.getFile(uid, params.basePath, FilePermissionEnum.W)
    const dest = await this.getFile(uid, params.destPath, FilePermissionEnum.W)
    return await this.files.copyFile(root, params.filename, dest)
  }
}
