import { IsOptionalString } from "src/core/decorators/dto-decorators/optional-string.decorator";
import { IsRequiredNumber } from "src/core/decorators/dto-decorators/required-number.decorator";

export class CreateWeightCardRequestDTO {
  @IsRequiredNumber({ example: 77 })
  weight: number;

  @IsOptionalString()
  photo?: string;

  @IsOptionalString()
  comment?: string;
}
