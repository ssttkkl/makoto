import { Controller, DefaultValuePipe, Delete, Get, ParseBoolPipe, ParseIntPipe, Put, Query, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { DataSource } from 'typeorm'

import { ShareFavMapperService } from './mapper.service'
import { type ShareFavDto } from './share-fav.dto'
import ShareFavService from './share-fav.service'

@Controller('v1/share/fav')
export class ShareFavController {
  constructor (
    private readonly dataSource: DataSource,
    private readonly favs: ShareFavService,
    private readonly mapper: ShareFavMapperService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get (
    @Req() req,
      @Query('excludeExpired', new DefaultValuePipe(false), ParseBoolPipe) excludeExpired: boolean
  ): Promise<ShareFavDto[]> {
    return await this.dataSource.transaction(async manager => {
      const favs = await this.favs.withTransaction(manager).get(req.user.uid, excludeExpired)
      const dto: ShareFavDto[] = []
      for (const x of favs) {
        dto.push(await this.mapper.withTransaction(manager).mapDto(x))
      }
      return dto
    })
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async fav (
    @Req() req,
      @Query('shareId', ParseIntPipe) shareId: number
  ): Promise<void> {
    await this.dataSource.transaction(async manager => {
      await this.favs.withTransaction(manager).fav(req.user.uid, shareId)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async unfav (
    @Req() req,
      @Query('shareId', ParseIntPipe) shareId: number
  ): Promise<void> {
    await this.dataSource.transaction(async manager => {
      await this.favs.withTransaction(manager).unfav(req.user.uid, shareId)
    })
  }
}
