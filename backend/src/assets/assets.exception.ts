import { NotFoundException } from '@nestjs/common'

export class AssetNotFoundException extends NotFoundException {
  constructor () {
    super('资源不存在')
  }
}
