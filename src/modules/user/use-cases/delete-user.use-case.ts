import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { IRepositoryResponse } from "src/core/ports/interfaces/repository-response.interface";
import { Utils } from "src/core/utils/utils.service";
import { MessageResponseDTO } from "src/interface-adapter/dtos/message.response.dto";
import { IMessage } from "src/interface-adapter/interfaces/message.interface";
import { UserRepositoryPort } from "../database/user.repository.port";
import { InjectUserRepository } from "../database/user.repository.provider";

@Injectable()
export class DeleteUser
  extends BaseUseCase
  implements IUseCase<string, IMessage>
{
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
    private readonly utils: Utils,
  ) {
    super();
  }

  public async execute(id: string): Promise<IMessage> {
    const session = await this.utils.transaction.startTransaction();
    let result: IRepositoryResponse;
    try {
      await session.withTransaction(async () => {
        result = await this.userRepository.delete({ _id: id });
      });

      return new MessageResponseDTO(`${result.n} documents deleted!`);
    } catch (err) {
      throw new ResponseException(err.message, err.status, err.trace);
    } finally {
      session.endSession();
    }
  }
}
