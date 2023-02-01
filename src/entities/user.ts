export default interface User {
  uid: number;
  username: string;
  nickname: string;
  avatar?: string;
}

export interface UserWithPassword extends User {
  password: string;
}
