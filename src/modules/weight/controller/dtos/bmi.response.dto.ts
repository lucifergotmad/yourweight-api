import { ApiProperty } from "@nestjs/swagger";
import { BMI } from "src/core/constants/app/bmi.const";
import { IBMIResponse } from "src/interface-adapter/interfaces/weight/weight.interface";

export class BMIResponseDTO implements IBMIResponse {
  constructor(props: IBMIResponse) {
    this.description = props.description;
    this.index = props.index;
  }

  @ApiProperty({ enum: BMI, example: BMI.Normal })
  description: string;

  @ApiProperty()
  index: number;
}
