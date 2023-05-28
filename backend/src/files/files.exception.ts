import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common'

export class FileNotFoundException extends NotFoundException {
  constructor () {
    super('文件不存在')
  }
}

export class DuplicatedFilenameException extends ConflictException {
  constructor () {
    super('此目录下已存在同名文件')
  }
}

export class FilePermissionDeniedException extends ForbiddenException {
  constructor () {
    super('你没有权限对该文件执行此操作')
  }
}

export class InvalidFileOperationException extends UnprocessableEntityException {
  constructor () {
    super('无法对该文件执行此操作')
  }
}

export class HangingFileLinkException extends NotFoundException {
  constructor () {
    super('链接的文件不可用。可能是原文件已被删除，或是文件拥有者取消了链接')
  }
}
