import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppConfig } from 'src/config/config'
import { AppConfigModule } from 'src/config/config.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfig],
      useFactory: (config: AppConfig) => {
        return {
          type: 'postgres',
          host: config.databaseHost,
          port: config.databasePort,
          username: config.databaseUser,
          password: config.databasePassword,
          database: config.databaseName,
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV === 'development'
        }
      }
    })
  ],
  exports: [TypeOrmModule]
})
export class DataModule {}
