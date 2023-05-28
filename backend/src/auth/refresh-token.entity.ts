import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class RefreshToken {
  @PrimaryColumn()
    refreshToken: string

  @Column()
    uid: number
}
