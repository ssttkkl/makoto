import { Controller, DefaultValuePipe, Get, ParseBoolPipe, ParseIntPipe, Put, Query, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { DataSource } from 'typeorm'

import ShareMapperService from '../common/mapper.service'
import { type ShareDto } from '../common/share.dto'
import ShareAccessRecordService from './share-access-record.service'

@Controller('v1/share/access-record')
export class ShareAccessRecordController {
  constructor (
    private readonly dataSource: DataSource,
    private readonly records: ShareAccessRecordService,
    private readonly mapper: ShareMapperService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get (
    @Req() req,
      @Query('excludeExpired', new DefaultValuePipe(false), ParseBoolPipe) excludeExpired: boolean
  ): Promise<ShareDto[]> {
    return await this.dataSource.transaction(async manager => {
      const shares = await this.records.withTransaction(manager).get(req.user.uid, excludeExpired)
      const dto: ShareDto[] = []
      for (const x of shares) {
        dto.push(await this.mapper.withTransaction(manager).mapDto(x, req.user.uid))
      }
      return dto
    })
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async put (
    @Req() req,
      @Query('shareId', ParseIntPipe) shareId: number
  ): Promise<void> {
    await this.dataSource.transaction(async manager => {
      await this.records.withTransaction(manager).put(req.user.uid, shareId)
    })
  }
}
