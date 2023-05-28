import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { createReadStream, type ReadStream } from 'fs'
import * as fs from 'fs/promises'
import * as path from 'path'
import { Asset } from 'src/data/asset.entities'
import { DataSource } from 'typeorm'
import { AssetNotFoundException } from './assets.exception'
import * as os from 'os'
import { AppConfig } from 'src/config/config'

@Injectable()
export default class AssetsService {
  storeRoot: string

  constructor (
    private readonly config: AppConfig,
    private readonly dataSource: DataSource
  ) {
    const storeRoot = this.config.assetStoreLocation
    if (storeRoot) {
      this.storeRoot = storeRoot
    } else if (os.platform() === 'win32') {
      this.storeRoot = path.join(process.env.APPDATA!, 'Local', 'makoto', 'assets')
    } else {
      this.storeRoot = '/opt/makoto/assets'
    }
  }

  async create (uid: number, mimetype: string, data: Buffer): Promise<Asset> {
    const now = new Date()

    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()

    const storeDir = path.join(year.toString(), month.toString(), day.toString())
    const absStoreDir = path.join(this.storeRoot, storeDir)
    await fs.mkdir(absStoreDir, { recursive: true })

    const storeFilename = randomUUID()
    const storePath = path.join(storeDir, storeFilename)
    const absStorePath = path.join(this.storeRoot, storePath)
    await fs.writeFile(absStorePath, data, { flag: 'ax' })

    const asset = new Asset()
    asset.ownerUid = uid
    asset.mimetype = mimetype
    asset.ctime = now
    asset.storePath = storePath

    return await this.dataSource.manager.save(asset)
  }

  async get (id: number): Promise<Asset> {
    const asset = await this.dataSource.manager.findOneBy(Asset, { id })
    if (asset === null) {
      throw new AssetNotFoundException()
    }
    return asset
  }

  createReadStream (asset: Asset): ReadStream {
    return createReadStream(path.join(this.storeRoot, asset.storePath))
  }
}
