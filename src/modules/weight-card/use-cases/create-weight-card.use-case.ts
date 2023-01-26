import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { Utils } from "src/core/utils/utils.service";
import { MessageResponseDTO } from "src/interface-adapter/dtos/message.response.dto";
import { CreateWeightCardRequestDTO } from "src/modules/weight/controller/dtos/create-weight-card.request.dto";
import { WeightRepositoryPort } from "src/modules/weight/database/weight.repository.port";
import { InjectWeightRepository } from "src/modules/weight/database/weight.repository.provider";
import { WeightCardRepositoryPort } from "../database/weight-card.repository.port";
import { InjectWeightCardRepository } from "../database/weight-card.repository.provider";
import { WeightCardEntity } from "../domain/weight-card.entity";

@Injectable()
export class CreateWeightCard
  extends BaseUseCase
  implements IUseCase<CreateWeightCardRequestDTO, MessageResponseDTO>
{
  constructor(
    @InjectWeightCardRepository
    private readonly weightCardRepository: WeightCardRepositoryPort,
    @InjectWeightRepository
    private readonly weightRepository: WeightRepositoryPort,
    private readonly utils: Utils,
  ) {
    super();
  }

  public async execute(
    body?: CreateWeightCardRequestDTO,
  ): Promise<MessageResponseDTO> {
    const session = await this.utils.transaction.startTransaction();
    let responseMessage: string;
    try {
      await session.withTransaction(async () => {
        const user = await this.weightRepository.findOneOrThrow(
          { username: this.user.username },
          "Username not found!",
        );

        if (!user.target) {
          if (user.weight < body.weight) {
            responseMessage = "Oopss, you're getting fat";
          } else {
            responseMessage = "Congrats, you got this!";
          }
        } else {
          if (user.target !== body.weight) {
            responseMessage = "Keep Going, you got this!";
          } else {
            responseMessage = "Congrats, you did it!";
          }
        }

        const weightCardEntity = WeightCardEntity.create({
          username: this.user.username,
          date: new Date(),
          weight: body.weight,
          photo: body?.photo,
          comment: body?.comment,
        });

        await this.weightCardRepository.save(weightCardEntity, session);

        await this.weightRepository.update(
          { username: this.user.username },
          { weight: body.weight },
          session,
        );
      });
      return new MessageResponseDTO(responseMessage);
    } catch (error) {
      throw new ResponseException(error.message, error.status, error.trace);
    } finally {
      session.endSession();
    }
  }
}
