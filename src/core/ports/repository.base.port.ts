import { ClientSession, FilterQuery, UpdateQuery } from "mongoose";
import { BaseEntityProps } from "../base-classes/domain/entity";
import { AdvancePartial } from "./interfaces/advance-partial.interface";
import { IPaginationMeta } from "./interfaces/pagination-meta.interface";
import { IRepositoryResponse } from "./interfaces/repository-response.interface";

export interface BaseRepositoryPort<
  MongoEntity,
  Entity extends BaseEntityProps,
> {
  findAll(session?: ClientSession): Promise<Array<MongoEntity>>;
  findOne(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoEntity>;

  findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoEntity>;
  findOneOrThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<MongoEntity>;

  findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<void>;
  findOneAndThrow(
    identifier: FilterQuery<MongoEntity>,
    errorMessage?: string,
    session?: ClientSession,
  ): Promise<void>;

  findOneLatest(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<MongoEntity>;
  findById(id: string, session?: ClientSession): Promise<MongoEntity>;
  findBy(
    identifier: FilterQuery<MongoEntity>,
    session?: ClientSession,
  ): Promise<Array<MongoEntity>>;
  findByPaginated(
    identifier: FilterQuery<MongoEntity>,
    paginationMeta: IPaginationMeta,
  ): Promise<Array<MongoEntity>>;
  count(): Promise<number>;
  countBy(identifier: FilterQuery<MongoEntity>): Promise<number>;
  save(entity: Entity, session?: ClientSession): Promise<IRepositoryResponse>;
  saveMany(
    entity: Entity[],
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  update(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  updateWithoutThrow(
    identifier: FilterQuery<MongoEntity>,
    data: UpdateQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  delete(
    identifier: FilterQuery<Partial<MongoEntity>>,
    session?: ClientSession,
  ): Promise<IRepositoryResponse>;
  deleteAll(session?: ClientSession): Promise<IRepositoryResponse>;
  prepareQuery(query: FilterQuery<MongoEntity>): FilterQuery<MongoEntity>;
}
