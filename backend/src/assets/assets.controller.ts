import { Controller, Get, ParseIntPipe, Post, Query, Response, Req, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { type AssetDto } from './assets.dto'
import AssetsService from './assets.service'

@Controller('v1/assets')
export default class AssetsController {
  constructor (
    private readonly assets: AssetsService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  // Maximum file size: 10MB
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async create (
    @Req() req,
      @UploadedFile() file: Express.Multer.File
  ): Promise<AssetDto> {
    const asset = await this.assets.create(req.user.uid, file.mimetype, file.buffer)
    return asset.toDto()
  }

  @Get('/meta')
  async getMeta (
    @Query('assetId', ParseIntPipe) assetId: number
  ): Promise<AssetDto> {
    const asset = await this.assets.get(assetId)
    return asset.toDto()
  }

  @Get()
  async read (
    @Response({ passthrough: true }) res,
      @Query('assetId', ParseIntPipe) assetId: number
  ): Promise<StreamableFile> {
    const asset = await this.assets.get(assetId)
    res.set({
      'Content-Type': asset.mimetype
    })
    const stream = this.assets.createReadStream(asset)
    return new StreamableFile(stream)
  }
}
