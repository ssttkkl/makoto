import { File, FilePermissionEnum } from 'src/data/files.entities'
import { User } from 'src/data/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class Share {
  @PrimaryGeneratedColumn({ name: 'id' })
    shareId: number

  @Column()
    title: string

  @Column()
    ownerUid: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerUid' })
    owner: Promise<User>

  @Column()
    permission: FilePermissionEnum

  @ManyToMany(() => File)
  @JoinTable({ name: 'share_files' })
    files: Promise<File[]>

  @Column()
    allowLink: boolean

  @Column()
    ctime: Date

  @Column()
    etime: Date
}
