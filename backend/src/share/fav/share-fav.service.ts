import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { TransactionFor } from 'nest-transact'
import { type FindOptionsWhere, MoreThan, Repository } from 'typeorm'
import { ShareFav } from '../../data/share-fav.entities'

@Injectable()
export default class ShareFavService extends TransactionFor<ShareFavService> {
  constructor (
    @InjectRepository(ShareFav)
    private readonly repo: Repository<ShareFav>,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async get (uid: number, excludeExpired: boolean): Promise<ShareFav[]> {
    const where: FindOptionsWhere<ShareFav> = { uid }

    if (excludeExpired) {
      where.share = { etime: MoreThan(new Date()) }
    }

    return await this.repo.find({
      where,
      order: {
        ctime: 'DESC'
      }
    })
  }

  async check (uid: number, shareId: number): Promise<boolean> {
    return await this.repo.countBy({ uid, shareId }) === 1
  }

  async fav (uid: number, shareId: number): Promise<void> {
    await this.repo.upsert({ uid, shareId }, ['uid', 'shareId'])
  }

  async unfav (uid: number, shareId: number): Promise<void> {
    await this.repo.delete({ uid, shareId })
  }
}
