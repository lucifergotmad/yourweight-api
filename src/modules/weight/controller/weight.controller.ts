import { Body } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse } from "@nestjs/swagger";
import { ControllerProperty } from "src/core/decorators/controller-decorators/class-decorators/controller-property.decorator";
import { SecurePost } from "src/core/decorators/controller-decorators/class-decorators/secure-post.decorator";
import { AuthUser } from "src/core/decorators/controller-decorators/param-decorators/auth-user.decorator";
import { MessageResponseDTO } from "src/interface-adapter/dtos/message.response.dto";
import { UserMongoEntity } from "src/modules/user/database/model/user.mongo-entity";
import { CreateWeightCard } from "src/modules/weight-card/use-cases/create-weight-card.use-case";
import { CreateWeightCardRequestDTO } from "./dtos/create-weight-card.request.dto";

@ControllerProperty("v1/weights", "Weights")
export class WeightController {
  constructor(private readonly createWeightCard: CreateWeightCard) {}

  @SecurePost()
  @ApiOkResponse({ type: MessageResponseDTO })
  @ApiBadRequestResponse({ description: "User not found!" })
  save(
    @Body() body: CreateWeightCardRequestDTO,
    @AuthUser() user: Partial<UserMongoEntity>,
  ) {
    return this.createWeightCard.execute(user.username, body);
  }
}
