import { ApiProperty } from "@nestjs/swagger";
import { IWeightChartResponse } from "src/interface-adapter/interfaces/weight/weight-chart.interface";

export class WeightChartResponseDTO implements IWeightChartResponse {
  /**
   *
   * @param props {IWeightChartResponse}
   *
   * Transform Plain object into DTO useful for whitelisting data,
   * this will avoid data leak, and preventing return a whole bunch
   * of data to client.
   */

  constructor(props: IWeightChartResponse) {
    this.label = props.label;
    this.weight = props.weight;
  }

  @ApiProperty({ example: "Mon" })
  label: string | number;

  @ApiProperty({ example: 87 })
  weight: number;
}
