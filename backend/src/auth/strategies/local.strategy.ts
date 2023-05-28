import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { type User } from 'src/data/user.entity'
import AuthService from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor (private readonly authService: AuthService) {
    super()
  }

  async validate (username: string, password: string): Promise<User> {
    const user = await this.authService.authByUsernameAndPassword(
      username,
      password
    )
    return user
  }
}
