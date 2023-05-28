import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Document {
  @PrimaryColumn()
    fid: number

  @Column('bytea')
    data: Buffer
}
