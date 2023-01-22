import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "src/core/base-classes/infra/repository.base";
import { Model } from "mongoose";
import { WeightCardMongoEntity } from "./model/weight-card.mongo-entity";
import { WeightCardEntity } from "../domain/weight-card.entity";
import { WeightCardRepositoryPort } from "./weight-card.repository.port";
import { WeightCardMongoMapper } from "./model/weight-card.mongo-mapper";

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
    );
  }

  // fill me with beautiful method!
  __init__(): void {
    //replace this lonely method!
  }
}
