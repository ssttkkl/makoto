import { forwardRef, Module } from '@nestjs/common'
import SpaceService from './space.service'
import SpaceController from './space.controller'
import { FilesModule } from '../../files/files.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from '../../data/files.entities'
import { ShareModule } from '../../share/share.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    forwardRef(() => FilesModule),
    forwardRef(() => ShareModule)
  ],
  providers: [SpaceService],
  controllers: [SpaceController],
  exports: [SpaceService]
})
export class SpaceCommonModule {
}
