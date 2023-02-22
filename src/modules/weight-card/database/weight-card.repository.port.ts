import { BaseRepositoryPort } from "src/core/ports/repository.base.port";
import { WeightCardMongoEntity } from "./model/weight-card.mongo-entity";
import { WeightCardEntity } from "../domain/weight-card.entity";
import { IWeightChartResponse } from "src/interface-adapter/interfaces/weight/weight-chart.interface";

export interface WeightCardRepositoryPort
  extends BaseRepositoryPort<WeightCardMongoEntity, WeightCardEntity> {
  getWeightChart(
    username: string,
    start_date: string,
    end_date: string,
  ): Promise<IWeightChartResponse[]>;
}
