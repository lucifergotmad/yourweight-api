import { ApiProperty } from "@nestjs/swagger";
import { BMI } from "src/core/constants/app/bmi.const";
import { IBMIResponse } from "src/interface-adapter/interfaces/weight/weight.interface";

export class BMIResponseDTO implements IBMIResponse {
  /**
   *
   * @param props {IBMIResponse}
   *
   * Transform Plain object into DTO useful for whitelisting data,
   * this will avoid data leak, and preventing return a whole bunch
   * of data to client.
   */

  constructor(props: IBMIResponse) {
    this.description = props.description;
    this.index = props.index;
  }

  @ApiProperty({ enum: BMI, example: BMI.Normal })
  description: string;

  @ApiProperty()
  index: number;
}
