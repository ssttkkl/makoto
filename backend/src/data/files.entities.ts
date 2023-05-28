import { RecycleBinEntity } from './recycle-bin.entities'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'

export type FileType = 'document' | 'folder' | 'link'

@Entity()
export class File {
  @PrimaryGeneratedColumn()
    fid: number

  @Column()
    uid: number

  @Column()
    filename: string

  @Column()
    type: FileType

  @Column({ nullable: true })
    parentFid: number | null

  @ManyToOne(() => File, async file => await file.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentFid' })
    parent: Promise<File | null>

  @OneToMany(() => File, async file => await file.parent)
    children: Promise<File[]>

  @Column({ nullable: true })
    recycleBinEntityId: number | null

  @OneToOne(() => RecycleBinEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'recycleBinEntityId' })
    recycleBinEntity: Promise<RecycleBinEntity | null>

  @Column()
    lastModifyUserUid: number

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'lastModifyUserUid' })
    lastModifyUser: Promise<User | null>

  @CreateDateColumn()
    ctime: Date

  @UpdateDateColumn()
    mtime: Date

  @UpdateDateColumn()
    atime: Date
}

export enum FilePermissionEnum {
  None = 0,
  R = 1,
  W = 2,
  X = 4,
  RW = 1 | 2,
  RWX = 1 | 2 | 4,
}

export function checkPermission (permission: FilePermissionEnum, expectedPermission: FilePermissionEnum): boolean {
  return (permission & expectedPermission) === expectedPermission
}

@Entity()
export class FileLink {
  @PrimaryColumn()
    fid: number

  @OneToOne(() => File, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'fid' })
    file: Promise<File>

  @Column({ nullable: true })
    refFid: number | null

  // 不允许多级引用（ref一定不能为link类型）
  @ManyToOne(() => File, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'refFid' })
    ref: Promise<File | null>

  @Column()
    permission: FilePermissionEnum
}
