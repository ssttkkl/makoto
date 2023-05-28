import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { TransactionFor } from 'nest-transact'
import FilesService from 'src/files/files.service'
import { Repository } from 'typeorm'
import { Document } from '../../data/document.entities'

@Injectable()
export default class DocumentCommonService extends TransactionFor<DocumentCommonService> {
  constructor (
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
    @Inject(forwardRef(() => FilesService))
    private readonly files: FilesService,
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }

  async getByFid (
    fid: number
  ): Promise<Document> {
    let doc = await this.documentsRepository.findOneBy({ fid })
    if (doc == null) {
      doc = new Document()
      doc.fid = fid
      doc.data = Buffer.alloc(0)
      doc = await this.documentsRepository.save(doc)
    }
    await this.files.markAccess(fid)
    return doc
  }

  async updateByFid (
    fid: number, data: Buffer, uid: number
  ): Promise<void> {
    await this.documentsRepository.createQueryBuilder()
      .insert()
      .into(Document)
      .values({ fid, data })
      .orUpdate(['data'], ['fid'])
      .execute()
    await this.files.markModify(fid, uid)
  }

  async copyByFid (
    srcFid: number, destFid: number, uid: number
  ): Promise<void> {
    const src = await this.getByFid(srcFid)
    await this.updateByFid(destFid, src.data, uid)
  }
}
