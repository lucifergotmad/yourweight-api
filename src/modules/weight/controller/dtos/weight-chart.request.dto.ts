import { IsRequiredString } from "src/core/decorators/dto-decorators/required-string.decorator";

export class WeightChartRequestDTO {
  @IsRequiredString({ example: "WEEKLY" })
  type: string;
}
