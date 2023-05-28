import { ConflictException, NotFoundException } from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
  constructor () {
    super('用户不存在')
  }
}

export class DuplicatedUsernameException extends ConflictException {
  constructor () {
    super('用户名已存在')
  }
}
