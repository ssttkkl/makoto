import { ForbiddenException, NotFoundException } from '@nestjs/common'

export class ShareNotFoundException extends NotFoundException {
  constructor () {
    super('分享不存在')
  }
}

export class ShareExpiredException extends ForbiddenException {
  constructor () {
    super('分享已失效')
  }
}

export class ShareOperationForbiddenException extends ForbiddenException {
  constructor () {
    super('你没有权限执行该操作')
  }
}
