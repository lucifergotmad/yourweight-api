import { BaseRepositoryPort } from "src/core/ports/repository.base.port";
import { WeightMongoEntity } from "./model/weight.mongo-entity";
import { WeightEntity } from "../domain/weight.entity";

export interface WeightRepositoryPort
  extends BaseRepositoryPort<WeightMongoEntity, WeightEntity> {
  __init__(): void;
}
