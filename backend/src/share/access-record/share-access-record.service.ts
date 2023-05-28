import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { TransactionFor } from 'nest-transact'
import { type FindOptionsWhere, MoreThan, Repository } from 'typeorm'
import { type Share } from '../../data/share.entities'
import { ShareAccessRecord } from '../../data/share-access-record.entities'

@Injectable()
export default class ShareAccessRecordService extends TransactionFor<ShareAccessRecordService> {
  constructor(
    @InjectRepository(ShareAccessRecord)
    private readonly repo: Repository<ShareAccessRecord>,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async get(uid: number, excludeExpired: boolean): Promise<Share[]> {
    const where: FindOptionsWhere<ShareAccessRecord> = {
      uid,
      ctime: MoreThan(new Date(Date.now() - 1000 * 86400 * 90)) // 仅查询90天以内的记录
    }

    if (excludeExpired) {
      where.share = { etime: MoreThan(new Date()) }
    }

    const records = await this.repo.find({
      where,
      order: {
        ctime: 'DESC'
      }
    })
    return records.map(x => x.share)
  }

  async put(uid: number, shareId: number): Promise<void> {
    if ((await this.repo.countBy({ uid, shareId })) === 0) {
      await this.repo.insert({ uid, shareId })
    } else {
      await this.repo.update({ uid, shareId }, { ctime: () => 'current_timestamp' })
    }
  }
}
