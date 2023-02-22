import { ClientSession, FilterQuery } from "mongoose";
import { BaseRepositoryPort } from "src/core/ports/repository.base.port";
import { IUserResponse } from "src/interface-adapter/interfaces/user/user.interface";
import { UserEntity } from "../domain/user.entity";
import { UserMongoEntity } from "./model/user.mongo-entity";

export interface UserRepositoryPort
  extends BaseRepositoryPort<UserMongoEntity, UserEntity> {
  findUserWithWeight(
    identifier: FilterQuery<UserMongoEntity>,
    session?: ClientSession,
  ): Promise<IUserResponse[]>;
}
