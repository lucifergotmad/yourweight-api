import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { UserReponseDTO } from "../controller/dtos/user.reponse.dto";
import { UserRepositoryPort } from "../database/user.repository.port";
import { InjectUserRepository } from "../database/user.repository.provider";

@Injectable()
export class FindUserById
  extends BaseUseCase
  implements IUseCase<string, UserReponseDTO>
{
  constructor(
    @InjectUserRepository private userRepository: UserRepositoryPort,
  ) {
    super();
  }

  public async execute(user_id: string): Promise<UserReponseDTO> {
    try {
      return new UserReponseDTO(await this.userRepository.findById(user_id));
    } catch (err) {
      throw new ResponseException(err.message, err.status, err.trace);
    }
  }
}
