import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "src/core/base-classes/infra/repository.base";
import { Model } from "mongoose";
import { WeightCardMongoEntity } from "./model/weight-card.mongo-entity";
import { WeightCardEntity } from "../domain/weight-card.entity";
import { WeightCardRepositoryPort } from "./weight-card.repository.port";
import { WeightCardMongoMapper } from "./model/weight-card.mongo-mapper";
import { WeightCardIgnore } from "src/core/constants/encryption/encryption-ignore";
import { IWeightChartResponse } from "src/interface-adapter/interfaces/weight/weight-chart.interface";

@Injectable()
export class WeightCardRepository
  extends BaseRepository<WeightCardMongoEntity, WeightCardEntity>
  implements WeightCardRepositoryPort
{
  constructor(
    @InjectModel(WeightCardMongoEntity.name)
    private weightCardModel: Model<WeightCardMongoEntity>,
  ) {
    super(
      weightCardModel,
      new WeightCardMongoMapper(WeightCardEntity, WeightCardMongoEntity),
      WeightCardIgnore,
    );
  }

  async getWeightChart(
    username: string,
    start_date: string,
    end_date: string,
  ): Promise<IWeightChartResponse[]> {
    const results = await this.weightCardModel.aggregate([
      {
        $match: {
          username,
        },
      },
      {
        $project: {
          date_array: { $split: [{ $toString: "$date" }, "T"] },
          weight: "$weight",
        },
      },
      {
        $addFields: {
          splitted_date: {
            $arrayElemAt: ["$date_array", 0],
          },
        },
      },
      {
        $match: {
          splitted_date: {
            $gte: start_date,
            $lte: end_date,
          },
        },
      },
      {
        $group: {
          _id: "$splitted_date",
          weight: {
            $last: "$weight",
          },
        },
      },
      {
        $project: {
          _id: 0,
          label: "$_id",
          weight: "$weight",
        },
      },
    ]);

    return this.encryptor.doDecrypt(results, WeightCardIgnore);
  }
}
