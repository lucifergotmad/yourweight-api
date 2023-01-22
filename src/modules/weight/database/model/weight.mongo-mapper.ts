import {
  DbMapper,
  MongoEntityProps,
} from "src/core/base-classes/domain/db-mapper";
import { WeightEntity } from "../../domain/weight.entity";
import { WeightMongoEntity } from "./weight.mongo-entity";

export class WeightMongoMapper extends DbMapper<
  WeightEntity,
  WeightMongoEntity
> {
  protected toMongoProps(
    entity: WeightEntity,
  ): MongoEntityProps<WeightMongoEntity> {
    const props = entity.getPropsCopy();

    const mongoProps: MongoEntityProps<WeightMongoEntity> = {
      ...props,
    };
    return mongoProps;
  }
}
