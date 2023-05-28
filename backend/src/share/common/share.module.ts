import { forwardRef, Module } from '@nestjs/common'
import { ShareService } from './share.service'
import { ShareController } from './share.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Share } from '../../data/share.entities'
import ShareMapperService from './mapper.service'
import { FilesModule } from 'src/files/files.module'
import { SpaceCommonModule } from 'src/space/common/space.module'
import { ShareFavModule } from '../fav/share-fav.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Share]),
    forwardRef(() => FilesModule),
    forwardRef(() => SpaceCommonModule),
    forwardRef(() => ShareFavModule)
  ],
  providers: [ShareService, ShareMapperService],
  controllers: [ShareController],
  exports: [ShareService, ShareMapperService]
})
export class ShareCommonModule {}
