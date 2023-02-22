import { ApiProperty } from "@nestjs/swagger";
import { IdResponseDTO } from "src/interface-adapter/dtos/id.response.dto";
import { IUserResponse } from "src/interface-adapter/interfaces/user/user.interface";

export class UserResponseDTO extends IdResponseDTO implements IUserResponse {
  /**
   *
   * @param props {IUserResponse}
   *
   * Transform Plain object into DTO useful for whitelisting data,
   * this will avoid data leak, and preventing return a whole bunch
   * of data to client.
   */
  constructor(props: IUserResponse) {
    super(props._id);
    this.username = props.username;
    this.weight = props.weight;
    this.height = props.height;
    this.age = props.age;
    this.target = props.target;
  }

  @ApiProperty({ example: "lucifer" })
  username: string;

  @ApiProperty({ example: 87 })
  weight: number;

  @ApiProperty({ example: 177 })
  height: number;

  @ApiProperty({ example: 22 })
  age: number;

  @ApiProperty({ example: 90 })
  target?: number;
}
