import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { DataModule } from './data/data.module'
import { UsersModule } from './users/users.module'
import { FilesModule } from './files/files.module'
import { ShareModule } from './share/share.module'
import { SpaceModule } from './space/space.module'
import { DocumentModule } from './document/document.module'
import { AssetsModule } from './assets/assets.module'
import { ChatModule } from './chat/chat.module'
import { AppConfigModule } from './config/config.module'

@Module({
  imports: [
    AppConfigModule,
    AssetsModule,
    DataModule,
    AuthModule,
    UsersModule,
    SpaceModule,
    FilesModule,
    ShareModule,
    DocumentModule,
    ChatModule
  ]
})
export class AppModule { }
