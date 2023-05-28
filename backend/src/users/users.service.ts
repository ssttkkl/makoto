import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { hash, verify } from 'argon2'
import { TransactionFor } from 'nest-transact'
import { IncorrectPasswordException } from 'src/auth/auth.exception'
import RefreshTokenService from 'src/auth/refresh-token.service'
import { QueryFailedError, Repository } from 'typeorm'
import { User } from '../data/user.entity'
import { type UserDto } from './user.dto'
import {
  DuplicatedUsernameException,
  UserNotFoundException
} from './user.exception'

@Injectable()
export default class UsersService extends TransactionFor<UsersService> {
  constructor (
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => RefreshTokenService))
    private readonly refreshTokens: RefreshTokenService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async addUser (user: User): Promise<User> {
    user.password = await hash(user.password)

    try {
      const result = await this.usersRepository.insert(user)
      user.uid = result.identifiers[0].uid
      return user
    } catch (err: unknown) {
      if (err instanceof QueryFailedError && err.driverError.code === '23505') {
        throw new DuplicatedUsernameException()
      } else {
        throw err
      }
    }
  }

  async findOneByUid (uid: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ uid })
    if (user != null) {
      return user
    } else {
      throw new UserNotFoundException()
    }
  }

  async findOneByUsername (username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username })
    if (user != null) {
      return user
    } else {
      throw new UserNotFoundException()
    }
  }

  async updatePassword (user: User, oldPassword: string, newPassword: string): Promise<User> {
    if (!await verify(user.password, oldPassword)) {
      throw new IncorrectPasswordException()
    }

    await this.refreshTokens.invalidate(user)

    user.password = await hash(newPassword)
    return await this.usersRepository.manager.save(user)
  }

  async updateProfile (user: User, update: Omit<UserDto, 'username' | 'uid'>): Promise<User> {
    Object.keys(update).forEach(k => {
      user[k] = update[k]
    })
    return await this.usersRepository.save(user)
  }
}
