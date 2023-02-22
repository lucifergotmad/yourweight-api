import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { UserResponseDTO } from "../controller/dtos/user.response.dto";
import { UserRepositoryPort } from "../database/user.repository.port";
import { InjectUserRepository } from "../database/user.repository.provider";

@Injectable()
export class FindAllUser
  extends BaseUseCase
  implements IUseCase<never, UserResponseDTO[]>
{
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
  ) {
    super();
  }

  async execute(): Promise<UserResponseDTO[]> {
    try {
      const results = await this.userRepository.findUserWithWeight({});
      return results.map((user) => new UserResponseDTO(user));
    } catch (error) {
      throw new ResponseException(error.message, error.status, error.trace);
    }
  }
}
