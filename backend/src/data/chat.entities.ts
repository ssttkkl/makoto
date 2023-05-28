import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    room: string

  @Column()
    content: string

  @Column()
    uid: number

  @Column()
    ctime: Date
}
