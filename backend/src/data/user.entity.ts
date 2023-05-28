import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'
import { type UserDto } from '../users/user.dto'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    uid: number

  @Column({
    length: 24
  })
  @Index({ unique: true })
    username: string

  @Column({
    length: 128
  })
    password: string

  @Column({
    length: 24
  })
    nickname: string

  toDto (): UserDto {
    return {
      uid: this.uid,
      username: this.username,
      nickname: this.nickname
    }
  }
}
