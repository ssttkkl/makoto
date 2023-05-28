import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export class EntityNotFoundException extends NotFoundException {
  constructor () {
    super('文件不存在')
  }
}

export class OrphanedException extends UnprocessableEntityException {
  constructor () {
    super('文件所在原位置已不存在，无法还原')
  }
}

export class FileInSharesException extends UnprocessableEntityException {
  constructor () {
    super('文件正在分享中，无法删除')
  }
}

export class FileHasLinksException extends UnprocessableEntityException {
  constructor () {
    super('文件拥有正在引用的链接，无法删除')
  }
}
