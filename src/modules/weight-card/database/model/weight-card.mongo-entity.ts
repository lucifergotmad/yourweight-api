import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseMongoEntity } from "src/core/base-classes/infra/mongo-entity.base";

@Schema({ collection: "weight_cards" })
export class WeightCardMongoEntity extends BaseMongoEntity<
  typeof WeightCardMongoEntity
> {
  @Prop({ required: true, index: 1 })
  username: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: false })
  photo?: string;

  @Prop({ required: false })
  comment?: string;
}

export const WeightCardSchema = SchemaFactory.createForClass(
  WeightCardMongoEntity,
);
export const WeightCardModel = [
  { name: WeightCardMongoEntity.name, schema: WeightCardSchema },
];

export type WeightCardDocument = WeightCardMongoEntity & Document;
