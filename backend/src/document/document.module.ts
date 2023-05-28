import { Module } from '@nestjs/common'
import { DocumentCommonModule } from './common/document.module'
import { DocumentFromShareModule } from './from-share/document.module'
import { DocumentFromSpaceModule } from './from-space/document.module'

@Module({
  imports: [
    DocumentCommonModule,
    DocumentFromShareModule,
    DocumentFromSpaceModule
  ],
  exports: [DocumentCommonModule]
})
export class DocumentModule {
}
