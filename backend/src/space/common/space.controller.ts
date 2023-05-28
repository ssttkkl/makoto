import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { type FileDto } from 'src/files/files.dto'
import { type FileType } from 'src/data/files.entities'
import FilesMapperService from 'src/files/mapper.service'
import { FilePath, splitPath, SplitPathPipe } from 'src/utils/path'
import SpaceService from './space.service'
import { InvalidFileOperationException } from 'src/files/files.exception'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { DataSource } from 'typeorm'

class CreateFileRequestBody {
  readonly filename: string
  readonly type: FileType
}

class CreateLinkRequestBody {
  readonly shareId: number
  readonly links: Array<{ filename: string, refPath: string }>
}

@Controller('v1/space')
export default class SpaceController {
  constructor (
    private readonly dataSource: DataSource,
    private readonly space: SpaceService,
    private readonly mapper: FilesMapperService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('file')
  async getFileInfo (
    @Req() req,
      @Query('path', SplitPathPipe) path: FilePath,
      @Query('depth', new DefaultValuePipe(1), ParseIntPipe) depth: number
  ): Promise<FileDto> {
    return await this.dataSource.transaction(async manager => {
      const file = await this.space.withTransaction(manager).getFile(req.user.uid, path)
      return await this.mapper.withTransaction(manager).mapDto(file, depth)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Post('file')
  async createFile (
    @Req() req,
      @Query('path', SplitPathPipe) path: FilePath,
      @Body() body: CreateFileRequestBody
  ): Promise<FileDto> {
    return await this.dataSource.transaction(async manager => {
      const file = await this.space.withTransaction(manager).createFile(req.user.uid, {
        ...body,
        basePath: path
      })
      return await this.mapper.withTransaction(manager).mapDto(file, 0)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Post('file/links')
  async createLink (
    @Req() req,
      @Query('path', SplitPathPipe) path: FilePath,
      @Body() body: CreateLinkRequestBody
  ): Promise<FileDto[]> {
    return await this.dataSource.transaction(async manager => {
      const links = await this.space.withTransaction(manager).createLink(req.user.uid, {
        shareId: body.shareId,
        basePath: path,
        links: body.links.map(x => ({ ...x, refPath: splitPath(x.refPath) }))
      })
      const dto: FileDto[] = []
      for (const link of links) {
        dto.push(await this.mapper.withTransaction(manager).mapLinkDto(link, 0))
      }
      return dto
    })
  }

  @UseGuards(JwtAuthGuard)
  @Put('file/filename')
  async renameFile (
    @Req() req,
      @Query('path', SplitPathPipe) path: FilePath,
      @Query('newFilename') newFilename: string
  ): Promise<FileDto> {
    return await this.dataSource.transaction(async manager => {
      if (path.length === 0) {
        throw new InvalidFileOperationException()
      }
      const file = await this.space.withTransaction(manager).renameFile(req.user.uid, {
        basePath: path.slice(0, -1),
        oldFilename: path[path.length - 1],
        newFilename
      })
      return await this.mapper.withTransaction(manager).mapDto(file, 0)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Post('file/move')
  async moveFile (
    @Req() req,
      @Query('path', SplitPathPipe) path: FilePath,
      @Query('destPath', SplitPathPipe) destPath: FilePath
  ): Promise<FileDto> {
    return await this.dataSource.transaction(async manager => {
      if (path.length === 0) {
        throw new InvalidFileOperationException()
      }
      const file = await this.space.withTransaction(manager).moveFile(req.user.uid, {
        basePath: path.slice(0, -1),
        filename: path[path.length - 1],
        destPath
      })
      return await this.mapper.withTransaction(manager).mapDto(file, 0)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Post('file/copy')
  async copyFile (
    @Req() req,
      @Query('path', SplitPathPipe) path: FilePath,
      @Query('destPath', SplitPathPipe) destPath: FilePath
  ): Promise<FileDto> {
    return await this.dataSource.transaction(async manager => {
      if (path.length === 0) {
        throw new InvalidFileOperationException()
      }
      const file = await this.space.withTransaction(manager).copyFile(req.user.uid, {
        basePath: path.slice(0, -1),
        filename: path[path.length - 1],
        destPath
      })
      return await this.mapper.withTransaction(manager).mapDto(file, 0)
    })
  }
}
