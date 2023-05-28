import { Injectable } from '@nestjs/common'
import { IncorrectPasswordException } from './auth.exception'
import { type Token } from './auth.dto'
import { JwtService } from '@nestjs/jwt'
import { type User } from 'src/data/user.entity'
import { AppConfig } from '../config/config'
import UsersService from 'src/users/users.service'
import { UserNotFoundException } from 'src/users/user.exception'
import RefreshTokenService from './refresh-token.service'
import { verify } from 'argon2'

@Injectable()
export default class AuthService {
  constructor (
    private readonly refreshTokensService: RefreshTokenService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: AppConfig
  ) {}

  async authByUsernameAndPassword (
    username: string,
    password: string
  ): Promise<User> {
    try {
      const user = await this.usersService.findOneByUsername(username)
      if (user != null && (await verify(user.password, password))) {
        return user
      } else {
        throw new IncorrectPasswordException()
      }
    } catch (err) {
      if (err instanceof UserNotFoundException) {
        throw new IncorrectPasswordException()
      } else {
        throw err
      }
    }
  }

  async authByRefreshToken (refreshToken: string): Promise<User> {
    const uid = await this.refreshTokensService.verify(refreshToken)
    const user = await this.usersService.findOneByUid(uid)
    return user
  }

  async login (user: User): Promise<Token> {
    const payload = { sub: user.uid, username: user.username }
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.refreshTokensService.get(user),
      expiresIn: this.config.jwtExpiresIn
    }
  }

  async refresh (refreshToken: string): Promise<Token> {
    const user = await this.authByRefreshToken(refreshToken)
    return await this.login(user)
  }
}
