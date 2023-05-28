import { Injectable, Logger } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { TransactionFor } from 'nest-transact'
import { concat, from, mergeMap, type Observable, fromEventPattern } from 'rxjs'
import { Chat } from 'src/data/chat.entities'
import { And, DataSource, type FindManyOptions, type FindOperator, LessThanOrEqual, MoreThan } from 'typeorm'

type EventHandler<T> = (data: T) => void

class EventBus<T = any> {
  handlers: Array<EventHandler<T>> = []
  onHandlerCountZero: (() => void) | null = null

  on (handler: EventHandler<T>) {
    this.handlers.push(handler)
  }

  off (handler: EventHandler<T>) {
    const i = this.handlers.findIndex(x => x === handler)
    if (i !== -1) {
      this.handlers.splice(i, 1)
    }
    if (this.handlers.length === 0) {
      (this.onHandlerCountZero != null) && this.onHandlerCountZero()
    }
  }

  send (data: T) {
    for (const handler of this.handlers) {
      handler(data)
    }
  }
}

@Injectable()
export class ChatService extends TransactionFor<ChatService> {
  eventBuses = new Map<string, EventBus<Chat>>()
  logger: Logger = new Logger(ChatService.name)

  constructor (
    private readonly dataSource: DataSource,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  private getEventBus (room: string, opts: { createIfNotExists: true }): EventBus<Chat>
  private getEventBus (room: string, opts?: { createIfNotExists: false }): EventBus<Chat> | null

  private getEventBus (room: string, opts?: { createIfNotExists?: boolean }): EventBus<Chat> | null {
    if (this.eventBuses.has(room)) {
      return this.eventBuses.get(room)!
    }

    if (opts?.createIfNotExists === true) {
      const eventBus = new EventBus()
      eventBus.onHandlerCountZero = () => {
        this.eventBuses.delete(room)
      }
      this.eventBuses.set(room, eventBus)
      return eventBus
    } else {
      return null
    }
  }

  async post (uid: number, room: string, content: string): Promise<Chat> {
    let chat = new Chat()
    chat.room = room
    chat.uid = uid
    chat.content = content
    chat.ctime = new Date()

    chat = await this.dataSource.manager.save(chat)

    const eventBus = this.getEventBus(room)
    if (eventBus !== null) {
      eventBus.send(chat)
    }

    return chat
  }

  async get (room: string, opts?: {
    before?: Date
    after?: Date
    limit?: number
    reversed?: boolean
  }): Promise<Chat[]> {
    const where: FindManyOptions<Chat>['where'] = { room }

    if ((opts?.before) != null) {
      where.ctime = LessThanOrEqual(opts.before)
    }

    if ((opts?.after) != null) {
      // 如果after是一个未来的时间，则直接返回空数组
      if (opts.after >= new Date()) {
        return []
      }

      if ('ctime' in where) {
        where.ctime = And(where.ctime as FindOperator<Date>, MoreThan(opts.after))
      } else {
        where.ctime = And(MoreThan(opts.after))
      }
    }

    return await this.dataSource.manager.find(Chat, {
      where,
      order: {
        id: opts?.reversed === true ? 'DESC' : 'ASC'
      },
      take: opts?.limit
    })
  }

  observe (room: string, opts?: {
    after?: Date
  }): Observable<Chat> {
    const now = new Date()

    const eventBus = this.getEventBus(room, { createIfNotExists: true })

    const futureChat = fromEventPattern<Chat>(f => { eventBus.on(f) }, f => { eventBus.off(f) })

    if (((opts?.after) == null) || opts.after >= now) {
      return futureChat
    } else {
      return concat(
        from(this.get(room, opts)).pipe(mergeMap(from)),
        futureChat
      )
    }
  }
}
