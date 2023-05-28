import { Injectable } from '@nestjs/common'
import {
  type LinkDto,
  type DocumentDto,
  type FileDto,
  type FolderDto
} from './files.dto'
import { type FileLink, type File, FilePermissionEnum } from '../data/files.entities'
import FilesService from './files.service'
import { TransactionFor } from 'nest-transact'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export default class FilesMapperService extends TransactionFor<FilesMapperService> {
  constructor (private readonly files: FilesService,
    moduleRef: ModuleRef) {
    super(moduleRef)
  }

  async mapLinkDto (
    link: FileLink,
    depth: number,
    permission: FilePermissionEnum = FilePermissionEnum.RWX
  ): Promise<LinkDto> {
    const file = await link.file
    const ref = await link.ref
    return {
      fid: file.fid,
      filename: file.filename,
      ctime: file.ctime,
      ownerUid: file.uid,
      type: 'link',
      ref: ref !== null
        ? await this.mapDto(
          ref,
          depth,
          permission & link.permission
        )
        : null,
      permission: permission & link.permission
    }
  }

  async mapFolderDto (file: File, depth: number): Promise<FolderDto> {
    let childrenDto: FileDto[] | undefined

    if (depth > 0) {
      const children = await this.files.getChildren(file)

      childrenDto = []
      for (const child of children) {
        childrenDto.push(await this.mapDto(child, depth - 1))
      }
    }

    return {
      fid: file.fid,
      filename: file.filename,
      ctime: file.ctime,
      ownerUid: file.uid,
      type: 'folder',
      children: childrenDto
    }
  }

  async mapDocumentDto (file: File): Promise<DocumentDto> {
    return {
      fid: file.fid,
      filename: file.filename,
      ctime: file.ctime,
      mtime: file.mtime,
      atime: file.atime,
      ownerUid: file.uid,
      lastModifyUserUid: file.lastModifyUserUid,
      type: 'document'
    }
  }

  async mapDto (
    file: File,
    depth: number,
    permission: FilePermissionEnum = FilePermissionEnum.RWX
  ): Promise<FileDto> {
    if (file.type === 'link') {
      const link = await this.files.getLink(file.fid)
      return await this.mapLinkDto(link, depth, permission)
    } else if (file.type === 'folder') {
      return await this.mapFolderDto(file, depth)
    } else {
      return await this.mapDocumentDto(file)
    }
  }
}
