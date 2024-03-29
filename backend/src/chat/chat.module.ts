import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chat } from 'src/data/chat.entities'
import ChatController from './chat.controller'
import { ChatService } from './chat.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat])
  ],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule { }
