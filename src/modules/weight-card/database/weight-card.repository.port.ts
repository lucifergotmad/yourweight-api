import { BaseRepositoryPort } from "src/core/ports/repository.base.port";
import { WeightCardMongoEntity } from "./model/weight-card.mongo-entity";
import { WeightCardEntity } from "../domain/weight-card.entity";

export interface WeightCardRepositoryPort
  extends BaseRepositoryPort<WeightCardMongoEntity, WeightCardEntity> {
  __init__(): void;
}
