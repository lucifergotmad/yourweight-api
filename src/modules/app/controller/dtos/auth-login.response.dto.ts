import { ApiProperty } from "@nestjs/swagger";
import { IdResponseDTO } from "src/interface-adapter/dtos/id.response.dto";
import { IAuthLoginResponse } from "src/interface-adapter/interfaces/auth-login/auth-login.response.interface";

export class AuthLoginResponseDTO
  extends IdResponseDTO
  implements IAuthLoginResponse
{
  constructor(props: IAuthLoginResponse) {
    super(props._id);
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
    this.username = props.username;
  }

  @ApiProperty({ example: "23498sdf98234-23498ydsf-23823h-sd8f324" })
  accessToken: string;

  @ApiProperty({ example: "23498sdf98234-23498ydsf-23823h-sd8f324" })
  refreshToken: string;

  @ApiProperty({ example: "lucifer" })
  username: string;
}
