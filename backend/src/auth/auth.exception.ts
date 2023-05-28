import { UnauthorizedException } from '@nestjs/common'

export class IncorrectPasswordException extends UnauthorizedException {
  constructor () {
    super('密码错误')
  }
}

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor () {
    super('令牌无效')
  }
}
