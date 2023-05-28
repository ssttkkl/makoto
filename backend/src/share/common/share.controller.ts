import {
  Get,
  Post,
  Controller,
  Body,
  Req,
  UseGuards,
  Query,
  Put,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common'
import ShareMapperService from './mapper.service'
import { ShareService } from './share.service'

import { type FileDto } from 'src/files/files.dto'
import FilesMapperService from 'src/files/mapper.service'
import { FilePath, splitPath, SplitPathPipe } from 'src/utils/path'
import { type ShareDto } from './share.dto'
import { ShareExpiredException } from './share.exception'
import { type FilePermissionEnum } from '../../data/files.entities'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { DataSource } from 'typeorm'

export class CreateShareRequestBody {
  readonly title: string
  readonly filePath: string[]
  readonly permission: FilePermissionEnum
  readonly expiresIn: number
  readonly allowLink: boolean
}

@Controller('v1/share')
export class ShareController {
  constructor (
    private readonly dataSource: DataSource,
    private readonly shares: ShareService,
    private readonly mapper: ShareMapperService,
    private readonly fileMapper: FilesMapperService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create (
    @Req() req,
      @Body() body: CreateShareRequestBody
  ): Promise<ShareDto> {
    return await this.dataSource.transaction(async manager => {
      const share = await this.shares.withTransaction(manager).create(req.user.uid, {
        ...body,
        filePath: body.filePath.map(splitPath)
      })
      return await this.mapper.withTransaction(manager).mapDto(share, req.user.uid)
    })
  }

  @Get()
  async get (
    @Req() req,
      @Query('shareId', ParseIntPipe) shareId: number
  ): Promise<ShareDto> {
    return await this.dataSource.transaction(async manager => {
      const share = await this.shares.withTransaction(manager).get(shareId)
      return await this.mapper.withTransaction(manager).mapDto(share, req.user?.uid, true)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Get('own')
  async getOwn (
    @Req() req
  ): Promise<ShareDto[]> {
    return await this.dataSource.transaction(async manager => {
      const share = await this.shares.withTransaction(manager).getOwn(req.user.uid)

      const dto: ShareDto[] = []
      for (const s of share) {
        dto.push(await this.mapper.mapDto(s, req.user.uid))
      }
      return dto
    })
  }

  @UseGuards(JwtAuthGuard)
  @Put('expired')
  async expire (
    @Req() req,
      @Query('shareId', ParseIntPipe) shareId: number
  ): Promise<void> {
    await this.dataSource.transaction(async manager => {
      await this.shares.withTransaction(manager).expire(req.user.uid, shareId)
    })
  }

  @Get('files')
  async getFiles (
    @Query('shareId', ParseIntPipe) shareId: number,
      @Query('path', SplitPathPipe) path: FilePath,
      @Query('depth', new DefaultValuePipe(1), ParseIntPipe) depth: number
  ): Promise<FileDto> {
    return await this.dataSource.transaction(async manager => {
      const share = await this.shares.withTransaction(manager).get(shareId)
      if (share.etime <= new Date()) {
        throw new ShareExpiredException()
      }

      const file = await this.shares.withTransaction(manager).getFile(share, path)
      return await this.fileMapper.withTransaction(manager).mapDto(file, depth, share.permission)
    })
  }
}
