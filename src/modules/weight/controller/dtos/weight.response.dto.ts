import { ApiProperty } from "@nestjs/swagger";
import { IWeightResponse } from "src/interface-adapter/interfaces/weight/weight.interface";

export class WeightResponseDTO implements IWeightResponse {
  /**
   * @param props {IWeightResponse}
   *
   * Transform Plain object into DTO useful for whitelisting data,
   * this will avoid data leak, and preventing return a whole bunch
   * of data to client.
   */
  constructor(props: IWeightResponse) {
    this.weight = props.weight;
  }

  @ApiProperty({ example: 77 })
  weight: number;
}
