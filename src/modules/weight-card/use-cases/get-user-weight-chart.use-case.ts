import moment from "moment-timezone";
import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { Utils } from "src/core/utils/utils.service";
import { WeightCardRepositoryPort } from "src/modules/weight-card/database/weight-card.repository.port";
import { InjectWeightCardRepository } from "src/modules/weight-card/database/weight-card.repository.provider";
import { WeightChartRequestDTO } from "../../weight/controller/dtos/weight-chart.request.dto";
import { WeightChartResponseDTO } from "../../weight/controller/dtos/weight-chart.response.dto";
import { IWeightChartResponse } from "src/interface-adapter/interfaces/weight/weight-chart.interface";

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

      const data = await this.weightCardRepository.getWeightChart(
        this.user.username,
        startOfTime,
        endOfTime,
      );

      const results = await this._generateChart(data, type);

      return results.map((chart) => new WeightChartResponseDTO(chart));
    } catch (error) {
      throw new ResponseException(error.message, error.status, error.trace);
    }
  }

  private async _generateChart(
    data: IWeightChartResponse[],
    type: string,
  ): Promise<IWeightChartResponse[]> {
    const count = this._generateIndex(type);
    const unitOfTime = this._generateUnitOfTime(type);

    const startOfTime = this.utils.date.startOf(unitOfTime, "YYYY-MM-DD");
    const yesterdayWeight = await this.weightCardRepository.findOneLatest({
      date: { $lt: new Date(startOfTime) },
    });

    let previousWeight = yesterdayWeight?.weight ?? 0;

    const results: IWeightChartResponse[] = [];

    for (let i = 0; i < count; i++) {
      const tanggal = this.utils.date.incrementDate(i, "days", startOfTime);
      const indexFound = data.findIndex((item) => item.label === tanggal);

      if (indexFound < 0) {
        results.push({
          label: +this.utils.date.formatDate(tanggal, "d"),
          weight: previousWeight,
        });
      } else {
        results.push({
          label: +this.utils.date.formatDate(tanggal, "d"),
          weight: data[indexFound].weight,
        });

        previousWeight = data[indexFound].weight;
      }
    }

    return results;
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
  private _generateIndex(type: string): number {
    let index: number;

    switch (type) {
      case "MONTHLY":
        index = 31;
        break;
      case "WEEKLY":
        index = 7;
        break;
      default:
        throw new BadRequestException("Invalid query for type!");
    }

    return index;
  }
}
