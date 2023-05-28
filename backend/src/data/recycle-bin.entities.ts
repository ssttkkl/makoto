import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { File } from './files.entities'

@Entity()
export class RecycleBinEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    fid: number

  @OneToOne(() => File, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fid' })
    file: Promise<File>

  @Column()
    uid: number

  @Column()
    path: string

  @CreateDateColumn()
    ctime: Date
}
