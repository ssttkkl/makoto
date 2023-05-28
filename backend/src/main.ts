import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { AppConfig } from './config/config'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)

  const options = new DocumentBuilder()
    .setTitle('makoto')
    .setDescription('The makoto API description')
    .setVersion('1.0')
    .addTag('makoto')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)

  const configService: AppConfig = app.get(AppConfig)
  await app.listen(configService.port)
}

bootstrap().catch(reason => {
  console.error(reason)
})
