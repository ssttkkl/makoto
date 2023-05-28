import { forwardRef, Inject } from '@nestjs/common'
import ShareMapperService from '../common/mapper.service'
import { type ShareFavDto } from './share-fav.dto'
import { type ShareFav } from '../../data/share-fav.entities'
import { TransactionFor } from 'nest-transact'
import { ModuleRef } from '@nestjs/core'

export class ShareFavMapperService extends TransactionFor<ShareFavMapperService> {
  constructor (
    @Inject(forwardRef(() => ShareMapperService))
    private readonly shareMapper: ShareMapperService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async mapDto (shareFav: ShareFav): Promise<ShareFavDto> {
    return {
      share: await this.shareMapper.mapDto(shareFav.share, shareFav.uid),
      ctime: shareFav.ctime
    }
  }
}
