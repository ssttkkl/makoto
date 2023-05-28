import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilesModule } from '../../files/files.module'
import { Document } from '../../data/document.entities'
import DocumentCommonService from './document.service'

@Module({
  imports: [
    forwardRef(() => FilesModule),
    TypeOrmModule.forFeature([Document])
  ],
  providers: [DocumentCommonService],
  exports: [DocumentCommonService]
})
export class DocumentCommonModule {
}
