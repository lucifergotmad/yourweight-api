import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseMongoEntity } from "src/core/base-classes/infra/mongo-entity.base";

@Schema({ collection: "users" })
export class UserMongoEntity extends BaseMongoEntity<typeof UserMongoEntity> {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true, default: false })
  is_confirmed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserMongoEntity);
export const UserModel = [{ name: UserMongoEntity.name, schema: UserSchema }];

export type UserDocument = UserMongoEntity & Document;
