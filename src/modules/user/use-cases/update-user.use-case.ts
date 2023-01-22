import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { IRepositoryResponse } from "src/core/ports/interfaces/repository-response.interface";
import { Utils } from "src/core/utils/utils.service";
import { MessageResponseDTO } from "src/interface-adapter/dtos/message.response.dto";
import { IId } from "src/interface-adapter/interfaces/id.interface";
import { UpdateUserRequestDTO } from "../controller/dtos/update-user.request.dto";
import { UserMongoEntity } from "../database/model/user.mongo-entity";
import { UserRepositoryPort } from "../database/user.repository.port";
import { InjectUserRepository } from "../database/user.repository.provider";

@Injectable()
export class UpdateUser
  extends BaseUseCase
  implements IUseCase<UpdateUserRequestDTO & IId, MessageResponseDTO>
{
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
    private readonly utils: Utils,
  ) {
    super();
  }

  async execute(data: UpdateUserRequestDTO & IId): Promise<MessageResponseDTO> {
    const session = await this.utils.transaction.startTransaction();
    let result: IRepositoryResponse;

    try {
      await session.withTransaction(async () => {
        const payload: Partial<UserMongoEntity> = data;
        result = await this.userRepository.update({ _id: data._id }, payload);
      });

      return new MessageResponseDTO(`${result.n} documents updated`);
    } catch (err) {
      throw new ResponseException(err.message, err.status, err.trace);
    } finally {
      session.endSession();
    }
  }
}
