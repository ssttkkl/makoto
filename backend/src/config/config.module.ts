import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppConfig } from './config'

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  providers: [AppConfig],
  exports: [AppConfig]
})
export class AppConfigModule { }
