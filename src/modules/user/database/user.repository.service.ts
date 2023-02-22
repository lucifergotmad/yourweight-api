import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, FilterQuery, Model } from "mongoose";
import { UserRepositoryPort } from "./user.repository.port";
import { UserMongoEntity } from "./model/user.mongo-entity";
import { BaseRepository } from "src/core/base-classes/infra/repository.base";
import { UserEntity } from "../domain/user.entity";
import { UserMongoMapper } from "./model/user.mongo-mapper";
import { UserIgnore } from "src/core/constants/encryption/encryption-ignore";
import { IUserResponse } from "src/interface-adapter/interfaces/user/user.interface";

@Injectable()
export class UserRepository
  extends BaseRepository<UserMongoEntity, UserEntity>
  implements UserRepositoryPort
{
  constructor(
    @InjectModel(UserMongoEntity.name)
    private userModel: Model<UserMongoEntity>,
  ) {
    super(
      userModel,
      new UserMongoMapper(UserEntity, UserMongoEntity),
      UserIgnore,
    );
  }

  async findUserWithWeight(
    identifier: FilterQuery<UserMongoEntity>,
    session?: ClientSession,
  ): Promise<IUserResponse[]> {
    const results = await this.userModel
      .aggregate([
        { $match: this.encryptor.doEncrypt(identifier, this.ignore) },
        {
          $lookup: {
            from: "weights",
            localField: "username",
            foreignField: "username",
            as: "weights",
          },
        },
        {
          $unwind: "$weights",
        },
        {
          $project: {
            _id: "$_id",
            username: "$username",
            weight: "$weights.weight",
            height: "$weights.height",
            age: "$weights.age",
            target: "$weights.target",
          },
        },
      ])
      .session(session);

    return this.encryptor.doDecrypt(results.length, UserIgnore);
  }
}
