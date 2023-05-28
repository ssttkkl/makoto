import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppConfigModule } from 'src/config/config.module'
import { Asset } from 'src/data/asset.entities'
import AssetsController from './assets.controller'
import AssetsService from './assets.service'

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([Asset])
  ],
  providers: [AssetsService],
  controllers: [AssetsController]
})
export class AssetsModule {
}
