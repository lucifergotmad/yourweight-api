import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "src/core/base-classes/infra/repository.base";
import { Model } from "mongoose";
import { WeightMongoEntity } from "./model/weight.mongo-entity";
import { WeightEntity } from "../domain/weight.entity";
import { WeightRepositoryPort } from "./weight.repository.port";
import { WeightMongoMapper } from "./model/weight.mongo-mapper";

@Injectable()
export class WeightRepository
  extends BaseRepository<WeightMongoEntity, WeightEntity>
  implements WeightRepositoryPort
{
  constructor(
    @InjectModel(WeightMongoEntity.name)
    private weightModel: Model<WeightMongoEntity>,
  ) {
    super(weightModel, new WeightMongoMapper(WeightEntity, WeightMongoEntity));
  }

  // fill me with beautiful method!
  __init__(): void {
    //replace this lonely method!
  }
}
