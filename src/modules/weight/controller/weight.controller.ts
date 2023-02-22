import { Body, Query } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { APIQueryProperty } from "src/core/decorators/controller-decorators/class-decorators/api-query-property.decorator";
import { ControllerProperty } from "src/core/decorators/controller-decorators/class-decorators/controller-property.decorator";
import { SecureGet } from "src/core/decorators/controller-decorators/class-decorators/secure-get.decorator";
import { SecurePost } from "src/core/decorators/controller-decorators/class-decorators/secure-post.decorator";
import { AuthUser } from "src/core/decorators/controller-decorators/param-decorators/auth-user.decorator";
import { MessageResponseDTO } from "src/interface-adapter/dtos/message.response.dto";
import { UserMongoEntity } from "src/modules/user/database/model/user.mongo-entity";
import { CreateWeightCard } from "src/modules/weight-card/use-cases/create-weight-card.use-case";
import { CalculateUserBMI } from "../use-cases/calculate-user-bmi.use-case";
import { FindWeightByUsername } from "../use-cases/find-weight-by-username.use-case";
import { GetUserWeightChart } from "../use-cases/get-user-weight-chart.use-case";
import { BMIResponseDTO } from "./dtos/bmi.response.dto";
import { CreateWeightCardRequestDTO } from "./dtos/create-weight-card.request.dto";
import { WeightChartRequestDTO } from "./dtos/weight-chart.request.dto";
import { WeightChartResponseDTO } from "./dtos/weight-chart.response.dto";
import { WeightResponseDTO } from "./dtos/weight.response.dto";

@ControllerProperty("v1/weights", "Weights")
export class WeightController {
  constructor(
    private readonly createWeightCard: CreateWeightCard,
    private readonly findWeightByUsername: FindWeightByUsername,
    private readonly calculateUserBMI: CalculateUserBMI,
    private readonly getUserWeightChart: GetUserWeightChart,
  ) {}

  @SecurePost()
  @ApiCreatedResponse({ type: MessageResponseDTO })
  @ApiBadRequestResponse({ description: "User not found!" })
  save(
    @Body() body: CreateWeightCardRequestDTO,
    @AuthUser() user: Partial<UserMongoEntity>,
  ) {
    return this.createWeightCard.injectDecodedToken(user).execute(body);
  }

  @SecureGet()
  @ApiOkResponse({ type: WeightResponseDTO })
  findOne(@AuthUser() user: Partial<UserMongoEntity>) {
    return this.findWeightByUsername.injectDecodedToken(user).execute();
  }

  @SecureGet("bmi")
  @ApiOkResponse({ type: BMIResponseDTO })
  findOneBMI(@AuthUser() user: Partial<UserMongoEntity>) {
    return this.calculateUserBMI.injectDecodedToken(user).execute();
  }

  @SecureGet("chart")
  @APIQueryProperty(["type"])
  @ApiOkResponse({ type: WeightChartResponseDTO })
  chartHandler(
    @Query() query: WeightChartRequestDTO,
    @AuthUser() user: Partial<UserMongoEntity>,
  ) {
    return this.getUserWeightChart.injectDecodedToken(user).execute(query);
  }
}
