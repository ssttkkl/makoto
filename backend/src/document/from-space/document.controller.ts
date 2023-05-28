import { Controller, Get, Put, Query, Req, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'

import { FilePath, SplitPathPipe } from 'src/utils/path'
import { FileInterceptor } from '@nestjs/platform-express'
import DocumentFromSpaceService from './document.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { DataSource } from 'typeorm'

@Controller('v1/space/document')
export default class DocumentFromSpaceController {
  constructor (
    private readonly dataSource: DataSource,
    private readonly fromSpace: DocumentFromSpaceService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get (
    @Req() req,
      @Query('path', SplitPathPipe) path: FilePath
  ): Promise<StreamableFile> {
    return await this.dataSource.transaction(async manager => {
      const doc = await this.fromSpace.withTransaction(manager).get(req.user.uid, path)
      return new StreamableFile(doc.data)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(FileInterceptor('data'))
  async update (
    @Req() req,
      @UploadedFile() data: Express.Multer.File,
      @Query('path', SplitPathPipe) path: FilePath
  ): Promise<void> {
    await this.dataSource.transaction(async manager => {
      await this.fromSpace.withTransaction(manager).update(req.user.uid, path, data.buffer)
    })
  }
}
