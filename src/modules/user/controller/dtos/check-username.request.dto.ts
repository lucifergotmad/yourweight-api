import { IsRequiredString } from "src/core/decorators/dto-decorators/required-string.decorator";

export class CheckUsernameRequestDTO {
  @IsRequiredString({ example: "lucifergotmad" })
  username: string;
}
