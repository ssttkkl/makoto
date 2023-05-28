import { Injectable } from '@nestjs/common'
import {
  DuplicatedFilenameException,
  FileNotFoundException,
  InvalidFileOperationException
} from 'src/files/files.exception'
import FilesService from 'src/files/files.service'
import SpaceService from '../common/space.service'
import { File, FilePermissionEnum } from 'src/data/files.entities'
import { Repository } from 'typeorm'
import { RecycleBinEntity } from '../../data/recycle-bin.entities'
import { InjectRepository } from '@nestjs/typeorm'
import { type FilePath, mergePath, splitPath } from 'src/utils/path'
import {
  EntityNotFoundException,
  FileHasLinksException,
  FileInSharesException,
  OrphanedException
} from './recycle-bin.exception'
import { ShareService } from 'src/share/common/share.service'
import { TransactionFor } from 'nest-transact'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class RecycleBinService extends TransactionFor<RecycleBinService> {
  constructor (
    private readonly files: FilesService,
    private readonly space: SpaceService,
    private readonly shares: ShareService,
    @InjectRepository(RecycleBinEntity)
    private readonly repo: Repository<RecycleBinEntity>,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async get (uid: number): Promise<RecycleBinEntity[]> {
    return await this.repo.find({
      where: { uid },
      order: { id: 'DESC' }
    })
  }

  async moveOut (uid: number, entityId: number): Promise<void> {
    const entity = await this.repo.findOneBy({ id: entityId })
    if (entity === null) {
      throw new EntityNotFoundException()
    }

    // ensure parent exists
    const path = splitPath(entity.path)
    let parent: File
    try {
      parent = await this.space.getFile(uid, path.slice(0, -1))
    } catch (err) {
      if (err instanceof FileNotFoundException) {
        throw new OrphanedException()
      } else {
        throw err
      }
    }

    // ensure filename not duplicated
    if (await this.files.getChild(parent, path[path.length - 1]) !== null) {
      throw new DuplicatedFilenameException()
    }

    await this.repo.delete({ id: entityId })
  }

  async moveIn (uid: number, path: FilePath): Promise<void> {
    if (path.length === 0) {
      throw new InvalidFileOperationException()
    }

    const file = await this.space.getFile(uid, path, FilePermissionEnum.W)

    const shares = await this.shares.getSharesContainingFile(file)
    if (shares.length !== 0) {
      throw new FileInSharesException()
    }

    const links = await this.files.getLinksReferencingToFile(file)
    if (links.length !== 0) {
      throw new FileHasLinksException()
    }

    let entity = new RecycleBinEntity()
    entity.uid = uid
    entity.fid = file.fid
    entity.path = mergePath(path)
    entity = await this.repo.save(entity, { reload: true })

    file.recycleBinEntityId = entity.id
    await this.fileRepo.save(file)
  }

  async deleteForever (uid: number, entityId: number): Promise<void> {
    const entity = await this.repo.findOneBy({ id: entityId, uid })
    if (entity === null) {
      throw new EntityNotFoundException()
    }

    await this.fileRepo.delete({ fid: entity.fid })
    await this.repo.delete({ id: entity.id })
  }
}
