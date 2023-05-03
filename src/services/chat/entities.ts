import { Type } from 'class-transformer';

export class Chat {
  id: number;

  room: string;

  content: string;

  uid: number;

  @Type(() => Date)
  ctime: Date;
}
