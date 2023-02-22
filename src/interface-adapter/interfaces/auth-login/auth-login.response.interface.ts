import { IId } from "../id.interface";

export interface IAuthLoginResponse extends IId {
  accessToken: string;
  refreshToken: string;
  username: string;
}
