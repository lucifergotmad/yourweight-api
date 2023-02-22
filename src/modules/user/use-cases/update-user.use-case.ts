import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { IRepositoryResponse } from "src/core/ports/interfaces/repository-response.interface";
import { Utils } from "src/core/utils/utils.service";
import { MessageResponseDTO } from "src/interface-adapter/dtos/message.response.dto";
import { IId } from "src/interface-adapter/interfaces/id.interface";
import { WeightRepositoryPort } from "src/modules/weight/database/weight.repository.port";
import { InjectWeightRepository } from "src/modules/weight/database/weight.repository.provider";
import { UpdateUserRequestDTO } from "../controller/dtos/update-user.request.dto";
import { UserRepositoryPort } from "../database/user.repository.port";
import { InjectUserRepository } from "../database/user.repository.provider";

@Injectable()
export class UpdateUser
  extends BaseUseCase
  implements IUseCase<UpdateUserRequestDTO & IId, MessageResponseDTO>
{
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
    @InjectWeightRepository
    private readonly weightRepository: WeightRepositoryPort,
    private readonly utils: Utils,
  ) {
    super();
  }

  async execute(data: UpdateUserRequestDTO & IId): Promise<MessageResponseDTO> {
    const session = await this.utils.transaction.startTransaction();
    let result: IRepositoryResponse;

    try {
      await session.withTransaction(async () => {
        await this.userRepository.findOneAndThrow(
          { username: data.username },
          "Username telah digunakan!",
          session,
        );

        await this.userRepository.findOneAndThrow(
          { email: data.email },
          "Email telah digunakan!",
          session,
        );

        await this.weightRepository.update(
          { username: data.username },
          { height: data.height, age: data.age, target: data?.target },
          session,
        );

        result = await this.userRepository.update(
          { _id: data._id },
          { username: data.username, email: data.email },
          session,
        );
      });

      return new MessageResponseDTO(`${result.n} documents updated`);
    } catch (err) {
      throw new ResponseException(err.message, err.status, err.trace);
    } finally {
      session.endSession();
    }
  }
}
