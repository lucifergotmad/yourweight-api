import { OmitType } from "@nestjs/swagger";
import { CreateUserRequestDTO } from "./create-user.request.dto";

export class UpdateUserRequestDTO extends OmitType(CreateUserRequestDTO, [
  "password",
  "weight",
]) {}
