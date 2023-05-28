import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShareCommonModule } from '../common/share.module'
import { ShareAccessRecordController } from './share-access-record.controller'
import { ShareAccessRecord } from '../../data/share-access-record.entities'
import ShareAccessRecordService from './share-access-record.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ShareAccessRecord]),
    ShareCommonModule
  ],
  providers: [ShareAccessRecordService],
  controllers: [ShareAccessRecordController]
})
export class ShareAccessRecordModule { }
