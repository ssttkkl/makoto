import { Controller, DefaultValuePipe, Get, ParseIntPipe, Put, Query, Req, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'

import { FilePath, SplitPathPipe } from 'src/utils/path'
import { FileInterceptor } from '@nestjs/platform-express'
import DocumentFromShareService from './document.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { DataSource } from 'typeorm'

@Controller('v1/share/document')
export default class DocumentFromShareController {
  constructor (
    private readonly dataSource: DataSource,
    private readonly fromShare: DocumentFromShareService
  ) { }

  @Get()
  async get (
    @Query('path', SplitPathPipe) path: FilePath,
      @Query('shareId', new DefaultValuePipe(0), ParseIntPipe) shareId: number
  ): Promise<StreamableFile> {
    return await this.dataSource.transaction(async manager => {
      const doc = await this.fromShare.withTransaction(manager).get(shareId, path)
      return new StreamableFile(doc.data)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(FileInterceptor('data'))
  async update (
    @Req() req,
      @UploadedFile() data: Express.Multer.File,
      @Query('path', SplitPathPipe) path: FilePath,
      @Query('shareId', new DefaultValuePipe(0), ParseIntPipe) shareId: number
  ): Promise<void> {
    await this.dataSource.transaction(async manager => {
      await this.fromShare.withTransaction(manager).update(req.user.uid, shareId, path, data.buffer)
    })
  }
}
