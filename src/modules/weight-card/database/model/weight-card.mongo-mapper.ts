import {
  DbMapper,
  MongoEntityProps,
} from "src/core/base-classes/domain/db-mapper";
import { WeightCardEntity } from "../../domain/weight-card.entity";
import { WeightCardMongoEntity } from "./weight-card.mongo-entity";

export class WeightCardMongoMapper extends DbMapper<
  WeightCardEntity,
  WeightCardMongoEntity
> {
  protected toMongoProps(
    entity: WeightCardEntity,
  ): MongoEntityProps<WeightCardMongoEntity> {
    const props = entity.getPropsCopy();

    const mongoProps: MongoEntityProps<WeightCardMongoEntity> = {
      ...props,
    };
    return mongoProps;
  }
}
