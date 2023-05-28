import { Module } from '@nestjs/common'
import { SpaceCommonModule } from './common/space.module'
import { RecycleBinModule } from './recycle-bin/recycle-bin.module'

@Module({
  imports: [SpaceCommonModule, RecycleBinModule],
  exports: [SpaceCommonModule, RecycleBinModule]
})
export class SpaceModule { }
