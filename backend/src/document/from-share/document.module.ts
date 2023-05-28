import { forwardRef, Module } from '@nestjs/common'
import { FilesModule } from '../../files/files.module'
import { ShareModule } from '../../share/share.module'
import DocumentFromShareService from './document.service'
import { DocumentCommonModule } from '../common/document.module'
import DocumentFromShareController from './document.controller'

@Module({
  imports: [
    forwardRef(() => FilesModule),
    DocumentCommonModule,
    ShareModule
  ],
  providers: [DocumentFromShareService],
  controllers: [DocumentFromShareController],
  exports: [DocumentFromShareService]
})
export class DocumentFromShareModule {
}
