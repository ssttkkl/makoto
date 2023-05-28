import { type MessageEvent, Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, Req, Sse, UseGuards, ParseBoolPipe } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { type ChatDto } from './chat.dto'
import { ChatService } from './chat.service'

class PostRequestBody {
  content: string
}

@Controller('v1/chat')
export default class ChatController {
  constructor (private readonly chats: ChatService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async post (
    @Req() req, @Query('room') room: string,
      @Body() body: PostRequestBody
  ): Promise<ChatDto> {
    return await this.chats.post(req.user.uid, room, body.content)
  }

  @Get()
  async get (
    @Query('room') room: string,
      @Query('before', new DefaultValuePipe(0), ParseIntPipe) before_: number,
      @Query('after', new DefaultValuePipe(0), ParseIntPipe) after_: number,
      @Query('limit', new DefaultValuePipe(0), ParseIntPipe) limit: number,
      @Query('reversed', new DefaultValuePipe(false), ParseBoolPipe) reversed: boolean
  ): Promise<ChatDto[]> {
    const before = before_ === 0 ? undefined : new Date(before_)
    const after = after_ === 0 ? undefined : new Date(after_)
    return await this.chats.get(room, { before, after, limit, reversed })
  }

  @Sse('sse')
  sse (
    @Query('room') room: string,
      @Query('after', new DefaultValuePipe(0), ParseIntPipe) after_: number
  ): Observable<MessageEvent> {
    const after = after_ === 0 ? undefined : new Date(after_)
    return this.chats.observe(room, { after }).pipe(
      map(data => ({ data }))
    )
  }
}
