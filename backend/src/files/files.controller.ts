import { Controller, Delete, forwardRef, Get, Inject, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common'
import FilesMapperService from './mapper.service'
import FilesService from './files.service'

import { type ShareDto } from '../share/common/share.dto'
import { type FileDto, type LinkDto } from './files.dto'
import ShareMapperService from '../share/common/mapper.service'
import { ShareService } from '../share/common/share.service'
import { DataSource } from 'typeorm'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

@Controller('v1/files')
export default class FilesController {
  constructor (
    private readonly dataSource: DataSource,
    private readonly files: FilesService,
    @Inject(forwardRef(() => ShareService))
    private readonly shares: ShareService,
    private readonly mapper: FilesMapperService,
    @Inject(forwardRef(() => ShareMapperService))
    private readonly shareMapper: ShareMapperService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get(':fid')
  private async getFile (
    @Req() req,
      @Param('fid', ParseIntPipe) fid: number
  ): Promise<FileDto> {
    return await this.dataSource.transaction(async manager => {
      const file = await this.files.withTransaction(manager).get(fid, { uid: req.user.uid, throwOnFailed: true })
      return await this.mapper.mapDto(file, 0)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Get(':fid/shares')
  private async getSharesContainingFile (
    @Req() req,
      @Param('fid', ParseIntPipe) fid: number
  ): Promise<ShareDto[]> {
    return await this.dataSource.transaction(async manager => {
      const file = await this.files.withTransaction(manager).get(fid, { uid: req.user.uid, throwOnFailed: true })
      const shares = await this.shares.withTransaction(manager).getSharesContainingFile(file)
      const dto: ShareDto[] = []
      for (const share of shares) {
        dto.push(await this.shareMapper.mapDto(share, req.user.uid))
      }
      return dto
    })
  }

  @UseGuards(JwtAuthGuard)
  @Get(':fid/links')
  async getLinksReferencingToFile (
    @Req() req,
      @Param('fid', ParseIntPipe) fid: number
  ): Promise<LinkDto[]> {
    return await this.dataSource.transaction(async manager => {
      const file = await this.files.withTransaction(manager).get(fid, { uid: req.user.uid, throwOnFailed: true })
      const links = await this.files.withTransaction(manager).getLinksReferencingToFile(file)
      const dto: LinkDto[] = []
      for (const link of links) {
        dto.push(await this.mapper.mapLinkDto(link, 0))
      }
      return dto
    })
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':fid/ref')
  async setLinkReferencingToNull (
    @Req() req,
      @Param('fid', ParseIntPipe) fid: number
  ): Promise<LinkDto> {
    return await this.dataSource.transaction(async manager => {
      const link = await this.files.withTransaction(manager).setLinkRefToNull(fid, req.user.uid)
      return await this.mapper.mapLinkDto(link, 0)
    })
  }
}
