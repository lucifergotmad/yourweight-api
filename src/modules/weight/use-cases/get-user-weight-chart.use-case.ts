import moment from "moment-timezone";
import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { Utils } from "src/core/utils/utils.service";
import { WeightCardRepositoryPort } from "src/modules/weight-card/database/weight-card.repository.port";
import { InjectWeightCardRepository } from "src/modules/weight-card/database/weight-card.repository.provider";
import { WeightChartRequestDTO } from "../controller/dtos/weight-chart.request.dto";
import { WeightChartResponseDTO } from "../controller/dtos/weight-chart.response.dto";

@Injectable()
export class GetUserWeightChart
  extends BaseUseCase
  implements IUseCase<WeightChartRequestDTO, WeightChartResponseDTO[]>
{
  constructor(
    @InjectWeightCardRepository
    private readonly weightCardRepository: WeightCardRepositoryPort,
    private readonly utils: Utils,
  ) {
    super();
  }

  async execute({
    type,
  }: WeightChartRequestDTO): Promise<WeightChartResponseDTO[]> {
    try {
      const unitOfTime = this._generateUnitOfTime(type);

      const startOfTime = this.utils.date.startOf(unitOfTime, "YYYY-MM-DD");
      const endOfTime = this.utils.date.endOf(unitOfTime, "YYYY-MM-DD");

      const results = await this.weightCardRepository.getWeightChart(
        this.user.username,
        startOfTime,
        endOfTime,
      );

      return results.map((chart) => new WeightChartResponseDTO(chart));
    } catch (error) {
      throw new ResponseException(error.message, error.status, error.trace);
    }
  }

  private _generateUnitOfTime(type: string): moment.unitOfTime.StartOf {
    let unitOfTime: moment.unitOfTime.StartOf;

    switch (type) {
      case "MONTHLY":
        unitOfTime = "month";
        break;
      case "WEEKLY":
        unitOfTime = "week";
        break;
      default:
        throw new BadRequestException("Invalid query for type!");
    }

    return unitOfTime;
  }
}
