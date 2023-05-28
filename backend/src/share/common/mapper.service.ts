import { Injectable, Inject } from '@nestjs/common'
import { forwardRef } from '@nestjs/common/utils'
import { type FileDto } from 'src/files/files.dto'
import FilesMapperService from 'src/files/mapper.service'
import ShareFavService from '../fav/share-fav.service'
import { type ShareDto } from './share.dto'
import { type Share } from '../../data/share.entities'
import { ModuleRef } from '@nestjs/core'
import { TransactionFor } from 'nest-transact'

@Injectable()
export default class ShareMapperService extends TransactionFor<ShareMapperService> {
  constructor (
    private readonly fileMapper: FilesMapperService,
    @Inject(forwardRef(() => ShareFavService))
    private readonly favs: ShareFavService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async mapDto (share: Share, uid: number, withFiles: boolean = false): Promise<ShareDto> {
    const expired = share.etime <= new Date()
    const fav = await this.favs.check(uid, share.shareId)

    let files: FileDto[] | undefined
    if (withFiles && !expired) {
      files = []
      for (const file of await share.files) {
        files.push(await this.fileMapper.mapDto(file, 0))
      }
    }

    return {
      shareId: share.shareId,
      title: share.title,
      ownerUid: share.ownerUid,
      files,
      permission: share.permission,
      allowLink: share.allowLink,
      ctime: share.ctime,
      etime: share.etime,
      expired,
      fav
    }
  }
}
