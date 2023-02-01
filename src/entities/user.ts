export default interface User {
  uid: number;
  username: string;
  nickname: string;
}

export interface UserWithPassword extends User {
  password: string;
}
