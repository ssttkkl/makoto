import { Module } from '@nestjs/common'
import { ShareAccessRecordModule } from './access-record/share-access-record.module'
import { ShareCommonModule } from './common/share.module'
import { ShareFavModule } from './fav/share-fav.module'

@Module({
  imports: [
    ShareCommonModule,
    ShareFavModule,
    ShareAccessRecordModule
  ],
  exports: [
    ShareCommonModule
  ]
})
export class ShareModule { }
