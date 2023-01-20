import { Injectable } from "@nestjs/common";
import {
  ClientSession,
  FilterQuery,
  isValidObjectId,
  Model,
  UpdateQuery,
} from "mongoose";
import { IRepositoryResponse } from "../../ports/interfaces/repository-response.interface";
import { BaseRepositoryPort } from "../../ports/repository.base.port";
import { IPaginationMeta } from "../../ports/interfaces/pagination-meta.interface";
import { DbMapper } from "../domain/db-mapper";
import { BaseEntityProps } from "../domain/entity";
import { ExceptionBadRequest } from "src/core/exceptions/bad-request.exception";
import { ExceptionNotFound } from "src/core/exceptions/not-found.exception";
import { ExceptionConflict } from "src/core/exceptions/conflict.exception";
import { AdvancePartial } from "src/core/ports/interfaces/advance-partial.interface";
import { TypeValidator } from "src/core/logic/type";
import { IEncryptorUtil } from "src/core/utils/modules/encryptor/encryptor.interface";
import { EncryptorUtil } from "src/core/utils/modules/encryptor/encryptor.service";
import { EnvService } from "src/infra/configs/env.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BaseRepository<MongoEntity, Entity extends BaseEntityProps>
  implements BaseRepositoryPort<MongoEntity, Entity>
{
  constructor(
    private readonly genericModel: Model<MongoEntity>,
    private readonly mapper: DbMapper<Entity, MongoEntity>,
    protected readonly ignore: string[] = [],
    protected readonly encryptor: IEncryptorUtil = new EncryptorUtil(
      new EnvService(new ConfigService()),
    ),
  ) {}

  async findAll(session?: ClientSession): Promise<Array<MongoEntity>> {
    const result = await this.genericModel.find().session(session).lean();
    return this.encryptor.doDecrypt(result, this.ignore);
  }

  async findOne(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoEntity> {
    const result = await this.genericModel
      .findOne(this.encryptor.doEncrypt(identifier, this.ignore))
      .session(session)
      .lean();

    return this.encryptor.doDecrypt(result, this.ignore);
  }

  async findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoEntity>;
  async findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<MongoEntity>;
  async findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    paramTwo?: string | ClientSession,
    paramThree?: ClientSession,
  ): Promise<MongoEntity> {
    const foundData = await this.genericModel
      .findOne(this.encryptor.doEncrypt(identifier, this.ignore))
      .session(typeof paramTwo !== "string" ? paramTwo : paramThree)
      .lean();
    if (!foundData) {
      throw new ExceptionNotFound(
        typeof paramTwo === "string"
          ? paramTwo
          : `E 404: DATA ${this.constructor.name
              .replace("Repository", "")
              .toUpperCase()} NOT FOUND`,
        this,
      );
    }
    return this.encryptor.doDecrypt(foundData, this.ignore);
  }

  async findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<void>;
  async findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<void>;
  async findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    paramTwo?: string | ClientSession,
    paramThree?: ClientSession,
  ): Promise<void> {
    const foundData = await this.genericModel
      .findOne(this.encryptor.doEncrypt(identifier, this.ignore))
      .session(typeof paramTwo !== "string" ? paramTwo : paramThree);
    if (foundData) {
      throw new ExceptionConflict(
        typeof paramTwo === "string"
          ? paramTwo
          : "" || `E 409: DATA ALREADY EXISTS`,
        this,
      );
    }
  }

  async findOneLatest(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoEntity> {
    const result = await this.genericModel
      .findOne(this.encryptor.doEncrypt(identifier, this.ignore))
      .sort({ _id: -1 })
      .session(session)
      .lean();
    return this.encryptor.doDecrypt(result, this.ignore);
  }

  async findById(id: string, session?: ClientSession): Promise<MongoEntity> {
    this._validateMongoID(id);
    const result = await this.genericModel.findById(id).session(session).lean();
    return this.encryptor.doDecrypt(result, this.ignore);
  }

  async findBy(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<Array<MongoEntity>> {
    const result = await this.genericModel
      .aggregate([
        { $match: this.encryptor.doEncrypt(identifier, this.ignore) },
      ])
      .session(session);

    return this.encryptor.doDecrypt(result, this.ignore);
  }

  async findByPaginated(
    identifier: FilterQuery<MongoEntity>,
    paginationMeta: IPaginationMeta,
  ) {
    const { limit = 100, skip = 0 } = paginationMeta;
    const result = await this.genericModel
      .find(this.encryptor.doEncrypt(identifier, this.ignore))
      .skip(skip)
      .limit(limit)
      .lean();
    return this.encryptor.doDecrypt(result, this.ignore);
  }

  async count(): Promise<number> {
    return await this.genericModel.find().countDocuments();
  }

  async countBy(identifier: FilterQuery<MongoEntity>): Promise<number> {
    return await this.genericModel
      .find(this.encryptor.doEncrypt(identifier, this.ignore))
      .countDocuments();
  }

  async save(
    entity: Entity,
    session?: ClientSession,
  ): Promise<IRepositoryResponse> {
    const mongoEntity = this.encryptor.doEncrypt(
      this.mapper.toMongoEntity(entity),
      this.ignore,
    );

    const newModel = new this.genericModel(mongoEntity);
    const result = await newModel.save({ session });
    return {
      _id: result._id,
    };
  }

  async saveMany(entities: Entity[], session?: ClientSession) {
    const mongoEntities = entities.map((entity) =>
      this.mapper.toMongoEntity(entity),
    );
    const mongoEntitiesEncrypted = this.encryptor.doEncrypt(
      mongoEntities,
      this.ignore,
    );
    await this.genericModel.insertMany(mongoEntitiesEncrypted, { session });
    return {
      message: "successfully inserted data!",
    };
  }

  async update(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse> {
    if (identifier._id) this._validateMongoID(identifier._id);

    const { n } = await this.genericModel.updateMany(
      this.encryptor.doEncrypt(identifier, this.ignore),
      this.encryptor.doEncrypt(data, this.ignore),
      {
        session,
      },
    );
    if (!n) {
      throw new ExceptionNotFound(
        `E 404: ${this.constructor.name
          .replace("Repository", "")
          .toUpperCase()} NOT FOUND, UPDATE FAILED`,
        this,
      );
    }
    return { n };
  }
  async updateWithoutThrow(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse> {
    if (identifier._id) this._validateMongoID(identifier._id);

    const { n } = await this.genericModel.updateMany(
      this.encryptor.doEncrypt(identifier, this.ignore),
      this.encryptor.doEncrypt(data, this.ignore),
      {
        session,
      },
    );

    return { n };
  }

  async delete(
    identifier: FilterQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse> {
    if (identifier._id) this._validateMongoID(identifier._id);

    const { n } = await this.genericModel.deleteMany(
      this.encryptor.doEncrypt(identifier, this.ignore),
      {
        session,
      },
    );
    if (!n)
      throw new ExceptionNotFound(
        `E 404: ${this.constructor.name
          .replace("Repository", "")
          .toUpperCase()} NOT FOUND, DELETE FAILED`,
        this,
      );
    return { n };
  }

  async deleteAll(session?: ClientSession): Promise<IRepositoryResponse> {
    const { n } = await this.genericModel.deleteMany({}, { session });
    return { n };
  }

  prepareQuery(query: FilterQuery<MongoEntity>): FilterQuery<MongoEntity> {
    const ref = { ...query };
    Object.keys(ref).forEach((key) => {
      const value = ref[key];
      if (
        TypeValidator.isObject(value) &&
        !TypeValidator.isDate(value) &&
        !TypeValidator.isArray(value)
      ) {
        Object.keys(value).map((key2: string) => {
          value[`$${key2}`] = value[key2];
          delete value[key2];
        });
        return;
      }
    });
    return ref;
  }

  private _validateMongoID(_id: string) {
    if (!isValidObjectId(_id))
      throw new ExceptionBadRequest("E 400: ID NOT VALID", this);
  }
}
