import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShareCommonModule } from '../common/share.module'
import { ShareFavMapperService } from './mapper.service'
import { ShareFavController } from './share-fav.controller'
import { ShareFav } from '../../data/share-fav.entities'
import ShareFavService from './share-fav.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ShareFav]),
    forwardRef(() => ShareCommonModule)
  ],
  providers: [ShareFavService, ShareFavMapperService],
  controllers: [ShareFavController],
  exports: [ShareFavService]
})
export class ShareFavModule { }
