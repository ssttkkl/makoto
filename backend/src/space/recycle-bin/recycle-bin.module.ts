import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilesModule } from '../../files/files.module'
import { ShareModule } from '../../share/share.module'
import { SpaceCommonModule } from '../common/space.module'
import RecycleBinMapperService from './mapper.service'
import { RecycleBinController } from './recycle-bin.controller'
import { RecycleBinEntity } from '../../data/recycle-bin.entities'
import { File } from '../../data/files.entities'
import { RecycleBinService } from './recycle-bin.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([RecycleBinEntity, File]),
    FilesModule,
    SpaceCommonModule,
    ShareModule
  ],
  providers: [RecycleBinService, RecycleBinMapperService],
  controllers: [RecycleBinController]
})
export class RecycleBinModule {
}
