import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseMongoEntity } from "src/core/base-classes/infra/mongo-entity.base";

@Schema({ collection: "weights" })
export class WeightMongoEntity extends BaseMongoEntity<
  typeof WeightMongoEntity
> {
  @Prop({ required: true, unique: true, index: 1 })
  username: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  age: number;

  @Prop({ required: false })
  target?: number;
}

export const WeightSchema = SchemaFactory.createForClass(WeightMongoEntity);
export const WeightModel = [
  { name: WeightMongoEntity.name, schema: WeightSchema },
];

export type WeightDocument = WeightMongoEntity & Document;
