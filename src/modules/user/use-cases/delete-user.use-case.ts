import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { IRepositoryResponse } from "src/core/ports/interfaces/repository-response.interface";
import { Utils } from "src/core/utils/utils.service";
import { MessageResponseDTO } from "src/interface-adapter/dtos/message.response.dto";
import { IMessage } from "src/interface-adapter/interfaces/message.interface";
import { WeightCardRepositoryPort } from "src/modules/weight-card/database/weight-card.repository.port";
import { InjectWeightCardRepository } from "src/modules/weight-card/database/weight-card.repository.provider";
import { WeightRepositoryPort } from "src/modules/weight/database/weight.repository.port";
import { InjectWeightRepository } from "src/modules/weight/database/weight.repository.provider";
import { UserRepositoryPort } from "../database/user.repository.port";
import { InjectUserRepository } from "../database/user.repository.provider";

@Injectable()
export class DeleteUser
  extends BaseUseCase
  implements IUseCase<string, IMessage>
{
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
    @InjectWeightRepository
    private readonly weightRepository: WeightRepositoryPort,
    @InjectWeightCardRepository
    private readonly weightCardRepository: WeightCardRepositoryPort,
    private readonly utils: Utils,
  ) {
    super();
  }

  public async execute(_id: string): Promise<IMessage> {
    const session = await this.utils.transaction.startTransaction();
    let result: IRepositoryResponse;
    try {
      await session.withTransaction(async () => {
        const user = await this.userRepository.findById(_id, session);

        await this.weightRepository.delete(
          { username: user.username },
          session,
        );
        await this.weightCardRepository.delete(
          { username: user.username },
          session,
        );

        result = await this.userRepository.delete({ _id }, session);
      });

      return new MessageResponseDTO(`${result.n} documents deleted!`);
    } catch (err) {
      throw new ResponseException(err.message, err.status, err.trace);
    } finally {
      session.endSession();
    }
  }
}
