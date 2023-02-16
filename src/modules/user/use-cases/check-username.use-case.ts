import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { MessageResponseDTO } from "src/interface-adapter/dtos/message.response.dto";
import { CheckUsernameRequestDTO } from "../controller/dtos/check-username.request.dto";
import { UserRepositoryPort } from "../database/user.repository.port";
import { InjectUserRepository } from "../database/user.repository.provider";

@Injectable()
export class CheckUsername
  extends BaseUseCase
  implements IUseCase<CheckUsernameRequestDTO, MessageResponseDTO>
{
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
  ) {
    super();
  }

  public async execute({
    username,
  }: CheckUsernameRequestDTO): Promise<MessageResponseDTO> {
    try {
      await this.userRepository.findOneAndThrow(
        { username },
        "Username telah dipakai",
      );
      return new MessageResponseDTO("Username tersedia!");
    } catch (error) {
      throw new ResponseException(error.message, error.status, error.trace);
    }
  }
}
