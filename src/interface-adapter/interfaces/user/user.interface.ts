import { IId } from "../id.interface";

export interface IUserResponse extends IId {
  username: string;
  weight: number;
  height: number;
  age: number;
  target?: number;
}
