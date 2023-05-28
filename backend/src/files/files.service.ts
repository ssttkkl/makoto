import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { IsNull } from 'typeorm'
import { checkPermission, File, FileLink, FilePermissionEnum, type FileType } from '../data/files.entities'
import {
  DuplicatedFilenameException,
  FileNotFoundException,
  FilePermissionDeniedException,
  HangingFileLinkException,
  InvalidFileOperationException
} from './files.exception'
import DocumentService from 'src/document/common/document.service'
import { type FilePath } from 'src/utils/path'
import { TransactionFor } from 'nest-transact'
import { ModuleRef } from '@nestjs/core'
import { Repository } from 'typeorm/repository/Repository'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export default class FilesService extends TransactionFor<FilesService> {
  constructor (
    @InjectRepository(FileLink)
    private readonly fileLinksRepository: Repository<FileLink>,
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
    @Inject(forwardRef(() => DocumentService))
    private readonly documents: DocumentService,
    /**
     * This is the needed thing for [TransactionFor<T>] logic working
     */
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async getLink (
    fid: number
  ): Promise<FileLink> {
    const link = await this.fileLinksRepository.findOneBy({ fid })
    if (link === null) {
      throw new FileNotFoundException()
    }
    return link
  }

  async setLinkRefToNull (
    fid: number, uid: number
  ): Promise<FileLink> {
    const link = await this.getLink(fid)
    const file = await link.file

    if (file.uid !== uid) {
      const ref = await link.ref
      if (ref === null || ref.uid !== uid) {
        throw new FilePermissionDeniedException()
      }
    }

    link.ref = Promise.resolve(null)
    return await this.fileLinksRepository.save(link)
  }

  async unref (
    file: File,
    ensurePermission?: FilePermissionEnum
  ): Promise<File> {
    if (file.type === 'link') {
      const link = await this.getLink(file.fid)

      const ref = await link.ref
      if (ref === null) {
        throw new HangingFileLinkException()
      }

      if (
        ensurePermission !== undefined &&
        !checkPermission(link.permission, ensurePermission)
      ) {
        throw new FilePermissionDeniedException()
      }

      return await this.unref(ref, ensurePermission)
    } else {
      return file
    }
  }

  async ensureFilenameNotDuplicated (
    root: File,
    filename: string
  ): Promise<void> {
    const cnt = await this.filesRepository.countBy({
      parentFid: root.fid,
      filename,
      recycleBinEntityId: IsNull()
    })
    if (cnt === 1) {
      throw new DuplicatedFilenameException()
    }
  }

  async createChild (params: {
    uid: number
    filename: string
    type: FileType
    parent?: File
  }): Promise<File> {
    const unrefParent =
      params.parent !== undefined
        ? await this.unref(params.parent, FilePermissionEnum.W)
        : null

    if (unrefParent?.type === 'document') {
      throw new InvalidFileOperationException()
    }

    if (unrefParent !== null) {
      await this.ensureFilenameNotDuplicated(unrefParent, params.filename)
    }

    let file = new File()
    file.uid = params.uid
    file.filename = params.filename
    file.type = params.type
    file.parent = Promise.resolve(unrefParent)
    file.lastModifyUserUid = params.uid
    file = await this.filesRepository.save(file)

    return file
  }

  async createLink (params: {
    uid: number
    filename: string
    parent?: File
    refFid: number | null
    permission: FilePermissionEnum
  }): Promise<FileLink> {
    const file = await this.createChild({ ...params, type: 'link' })

    let link = new FileLink()
    link.refFid = params.refFid
    link.permission = params.permission
    link.fid = file.fid
    link = await this.fileLinksRepository.save(link)

    return link
  }

  async get (fid: number, params?: {
    throwOnFailed: true
    uid?: number
  }): Promise<File>
  async get (fid: number, params?: {
    throwOnFailed?: false
    uid?: number
  }): Promise<File | null>

  async get (fid: number, params?: {
    throwOnFailed?: boolean
    uid?: number
  }): Promise<File | null> {
    const file = await this.filesRepository.findOneBy({ fid })
    if (params?.throwOnFailed === true) {
      if (file === null) {
        throw new FileNotFoundException()
      }
      if (file.uid !== params?.uid) {
        throw new FilePermissionDeniedException()
      }
    }
    return file
  }

  async getChild (
    parent: File,
    filename: string,
    ensurePermission?: FilePermissionEnum
  ): Promise<File | null> {
    const unrefParent = await this.unref(parent, ensurePermission)
    return await this.filesRepository.findOne({
      where: {
        parent: { fid: unrefParent.fid },
        filename,
        recycleBinEntityId: IsNull()
      }
    })
  }

  async getChildren (
    parent: File,
    ensurePermission?: FilePermissionEnum
  ): Promise<File[]> {
    const unrefParent = await this.unref(parent, ensurePermission)
    return await this.filesRepository.find({
      where: {
        parent: { fid: unrefParent.fid },
        recycleBinEntityId: IsNull()
      }
    })
  }

  async getLinksReferencingToFile (
    ref: File
  ): Promise<FileLink[]> {
    return await this.fileLinksRepository.findBy({ ref: { fid: ref.fid } })
  }

  async navigateTo (
    root: File,
    path: FilePath,
    ensurePermission?: FilePermissionEnum
  ): Promise<File | null> {
    let file = root
    for (const p of path) {
      if (file.type === 'document') {
        throw new InvalidFileOperationException()
      }

      const child = await this.getChild(file, p, ensurePermission)
      if (child === null) {
        return null
      } else {
        file = child
      }
    }
    return file
  }

  async renameFile (
    root: File,
    oldFilename: string,
    newFilename: string
  ): Promise<File> {
    const file = await this.getChild(root, oldFilename, FilePermissionEnum.W)
    if (file === null) {
      throw new FileNotFoundException()
    }

    await this.ensureFilenameNotDuplicated(root, newFilename)

    file.filename = newFilename
    return await this.filesRepository.save(file)
  }

  async moveFile (
    root: File,
    filename: string,
    dest: File
  ): Promise<File> {
    const file = await this.getChild(root, filename, FilePermissionEnum.W)
    if (file === null) {
      throw new FileNotFoundException()
    }

    // 同时检查了目标位置与源位置是否相同
    await this.ensureFilenameNotDuplicated(dest, filename)

    file.parentFid = dest.fid
    return await this.filesRepository.save(file)
  }

  async copyFile (
    root: File,
    filename: string,
    dest: File
  ): Promise<File> {
    const file = await this.getChild(root, filename, FilePermissionEnum.W)
    if (file === null) {
      throw new FileNotFoundException()
    }

    const unrefDest = await this.unref(dest, FilePermissionEnum.W)

    // 同时检查了目标位置与源位置是否相同
    await this.ensureFilenameNotDuplicated(unrefDest, filename)

    let copiedFile: File | null = null

    const queue = [{ src: file, dest: unrefDest }]
    while (queue.length > 0) {
      const front = queue.splice(0, 1)[0]
      if (front.src.type === 'folder') {
        const nextDest = await this.createChild({
          parent: front.dest,
          type: 'folder',
          uid: dest.uid,
          filename: front.src.filename
        })

        if (copiedFile === null) {
          copiedFile = nextDest
        }

        const children = await this.getChildren(front.src, undefined)
        for (const next of children) {
          queue.push({ src: next, dest: nextDest })
        }
      } else if (front.src.type === 'document') {
        const newFile = await this.createChild({
          parent: front.dest,
          type: 'document',
          uid: dest.uid,
          filename: front.src.filename
        })
        await this.documents.copyByFid(front.src.fid, newFile.fid, dest.uid)

        if (copiedFile === null) {
          copiedFile = newFile
        }
      } else if (front.src.type === 'link') {
        const link = await this.getLink(front.src.fid)
        const newLink = await this.createLink({
          parent: front.dest,
          uid: dest.uid,
          filename: front.src.filename,
          refFid: link.refFid,
          permission: link.permission
        })

        if (copiedFile === null) {
          copiedFile = await newLink.file
        }
      }
    }
    return copiedFile!
  }

  async markAccess (fid: number): Promise<void> {
    const file = await this.get(fid)

    await this.filesRepository.update(
      { fid },
      {
        atime: () => 'current_timestamp',
        mtime: file.mtime // 防止更新mtime
      }
    )
  }

  async markModify (fid: number, uid: number): Promise<void> {
    await this.filesRepository.update(
      { fid },
      {
        atime: () => 'current_timestamp',
        mtime: () => 'current_timestamp',
        lastModifyUserUid: uid
      }
    )
  }
}
