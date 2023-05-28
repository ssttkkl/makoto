import { forwardRef, Module } from '@nestjs/common'
import { FilesModule } from '../../files/files.module'
import { SpaceModule } from '../../space/space.module'
import DocumentFromSpaceService from './document.service'
import { DocumentCommonModule } from '../common/document.module'
import DocumentFromSpaceController from './document.controller'

@Module({
  imports: [
    forwardRef(() => FilesModule),
    DocumentCommonModule,
    SpaceModule
  ],
  providers: [DocumentFromSpaceService],
  controllers: [DocumentFromSpaceController],
  exports: [DocumentFromSpaceService]
})
export class DocumentFromSpaceModule {
}
