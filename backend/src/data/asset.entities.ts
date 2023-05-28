import { type AssetDto } from 'src/assets/assets.dto'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    ownerUid: number

  @Column()
    storePath: string

  @Column()
    mimetype: string

  @Column()
    ctime: Date

  toDto (): AssetDto {
    return {
      id: this.id,
      ownerUid: this.ownerUid,
      mimetype: this.mimetype,
      ctime: this.ctime
    }
  }
}
