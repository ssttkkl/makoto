import { Body, Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { splitPath } from 'src/utils/path'
import { DataSource } from 'typeorm'
import RecycleBinMapperService from './mapper.service'
import { type RecycleBinEntityDto } from './recycle-bin.dto'
import { RecycleBinService } from './recycle-bin.service'

class MoveInRequestBody {
  path: string[]
}

class MoveOutRequestBody {
  entityId: number[]
}

type DeleteForeverRequestBody = MoveOutRequestBody

@Controller('v1/space/recycle-bin')
export class RecycleBinController {
  constructor (
    private readonly dataSource: DataSource,
    private readonly recycleBin: RecycleBinService,
    private readonly mapper: RecycleBinMapperService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get (
    @Req() req
  ): Promise<RecycleBinEntityDto[]> {
    return await this.dataSource.transaction(async manager => {
      const entities = await this.recycleBin.withTransaction(manager).get(req.user.uid)
      const dto: RecycleBinEntityDto[] = []
      for (const entity of entities) {
        dto.push(await this.mapper.withTransaction(manager).mapDto(entity))
      }
      return dto
    })
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async moveIn (
    @Req() req,
      @Body() body: MoveInRequestBody
  ): Promise<void> {
    await this.dataSource.transaction(async manager => {
      for (const path of body.path) {
        await this.recycleBin.withTransaction(manager).moveIn(req.user.uid, splitPath(path))
      }
    })
  }

  @UseGuards(JwtAuthGuard)
  @Put('out')
  async moveOut (
    @Req() req,
      @Body() body: MoveOutRequestBody
  ): Promise<void> {
    await this.dataSource.transaction(async manager => {
      body.entityId.sort((a, b) => b - a) // 按照删除顺序的倒序还原
      for (const entityId of body.entityId) {
        await this.recycleBin.withTransaction(manager).moveOut(req.user.uid, entityId)
      }
    })
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteForever (
    @Req() req,
      @Body() body: DeleteForeverRequestBody
  ): Promise<void> {
    await this.dataSource.transaction(async manager => {
      for (const entityId of body.entityId) {
        await this.recycleBin.withTransaction(manager).deleteForever(req.user.uid, entityId)
      }
    })
  }
}
