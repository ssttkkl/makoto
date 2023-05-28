import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import FilesService from './files.service'
import { File, FileLink } from '../data/files.entities'
import FilesMapperService from './mapper.service'
import { ShareModule } from '../share/share.module'
import FilesController from './files.controller'
import { DocumentCommonModule } from 'src/document/common/document.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([File, FileLink]),
    forwardRef(() => ShareModule),
    forwardRef(() => DocumentCommonModule)
  ],
  providers: [FilesService, FilesMapperService],
  exports: [FilesService, FilesMapperService],
  controllers: [FilesController]
})
export class FilesModule { }
