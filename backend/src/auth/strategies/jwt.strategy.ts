import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AppConfig } from '../../config/config'
import UsersService from 'src/users/users.service'
import { type User } from 'src/data/user.entity'
import * as fs from 'fs'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (config: AppConfig, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret
    })
  }

  async validate (payload: any): Promise<User> {
    const { sub } = payload
    return await this.usersService.findOneByUid(sub)
  }
}
