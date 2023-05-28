import { Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { Share } from './share.entities'

@Entity()
export class ShareAccessRecord {
  @PrimaryColumn()
    uid: number

  @PrimaryColumn()
    shareId: number

  @ManyToOne(() => Share, { eager: true })
  @JoinColumn({ name: 'shareId' })
    share: Share

  @UpdateDateColumn()
    ctime: Date
}
