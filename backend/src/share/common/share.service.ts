import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import FilesService from 'src/files/files.service'
import { type File, FilePermissionEnum, checkPermission } from 'src/data/files.entities'
import { FileNotFoundException, FilePermissionDeniedException } from 'src/files/files.exception'
import { MoreThan, Repository } from 'typeorm'
import { Share } from '../../data/share.entities'
import {
  ShareNotFoundException,
  ShareOperationForbiddenException
} from './share.exception'
import SpaceService from 'src/space/common/space.service'
import { type FilePath } from 'src/utils/path'
import { TransactionFor } from 'nest-transact'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class ShareService extends TransactionFor<ShareService> {
  constructor (
    @InjectRepository(Share)
    private readonly shareRepo: Repository<Share>,
    private readonly files: FilesService,
    @Inject(forwardRef(() => SpaceService))
    private readonly spaceService: SpaceService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async get (shareId: number): Promise<Share> {
    const share = await this.shareRepo.findOneBy({ shareId })

    if (share !== null) {
      return share
    } else {
      throw new ShareNotFoundException()
    }
  }

  async getOwn (uid: number): Promise<Share[]> {
    return await this.shareRepo.find({
      where: {
        ownerUid: uid,
        etime: MoreThan(new Date())
      },
      order: {
        ctime: 'DESC'
      }
    })
  }

  async create (uid: number, params: {
    title: string
    filePath: FilePath[]
    permission: FilePermissionEnum
    expiresIn: number
    allowLink: boolean
  }): Promise<Share> {
    const share = new Share()

    share.ownerUid = uid
    share.title = params.title
    share.permission = params.permission
    share.allowLink = params.allowLink

    const files: File[] = []
    for (const p of params.filePath) {
      const file = await this.spaceService.getFile(uid, p, params.permission | FilePermissionEnum.X)
      files.push(file)
    }

    // check file permissions
    const queue = [...files]
    while (queue.length > 0) {
      const front = queue.splice(0, 1)[0]

      if (front.type === 'folder') {
        queue.push(...await this.files.getChildren(front))
      }

      if (front.type === 'link') {
        const link = await this.files.getLink(front.fid)
        if (!checkPermission(link.permission, params.permission | FilePermissionEnum.X)) {
          throw new FilePermissionDeniedException()
        }
      }
    }

    share.files = Promise.resolve(files)

    const ctime = Date.now()
    const etime = ctime + params.expiresIn

    share.ctime = new Date(ctime)
    share.etime = new Date(etime)

    return await this.shareRepo.save(share)
  }

  async expire (uid: number, shareId: number): Promise<void> {
    const share = await this.get(shareId)
    if (share.ownerUid !== uid) {
      throw new ShareOperationForbiddenException()
    }
    share.etime = new Date()
    await this.shareRepo.save(share)
  }

  async getFile (share: Share, path: FilePath = []): Promise<File> {
    if (path.length === 0) {
      throw new FileNotFoundException()
    } else {
      for (const root of await share.files) {
        if (root.filename === path[0]) {
          const file = await this.files.navigateTo(
            root,
            path.slice(1),
            FilePermissionEnum.R
          )
          if (file != null) {
            return file
          } else {
            throw new FileNotFoundException()
          }
        }
      }
      throw new FileNotFoundException()
    }
  }

  async getSharesContainingFile (file: File): Promise<Share[]> {
    const shares = await this.shareRepo
      .createQueryBuilder('share')
      .innerJoinAndSelect('share.files', 'file', 'file.fid = :fid', { fid: file.fid })
      .where('share.etime > :now', { now: new Date() })
      .getMany()
    return shares
  }
}
