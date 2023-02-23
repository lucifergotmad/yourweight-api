import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { WeightRepositoryPort } from "src/modules/weight/database/weight.repository.port";
import { InjectWeightRepository } from "src/modules/weight/database/weight.repository.provider";
import { UserResponseDTO } from "../controller/dtos/user.response.dto";
import { UserRepositoryPort } from "../database/user.repository.port";
import { InjectUserRepository } from "../database/user.repository.provider";

@Injectable()
export class FindUserById
  extends BaseUseCase
  implements IUseCase<string, UserResponseDTO>
{
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
    @InjectWeightRepository
    private readonly weightRepository: WeightRepositoryPort,
  ) {
    super();
  }

  public async execute(user_id: string): Promise<UserResponseDTO> {
    try {
      const user = await this.userRepository.findById(user_id);
      const data = await this.weightRepository.findOneOrThrow(
        { username: user.username },
        "Username tidak ditemukan!",
      );

      return new UserResponseDTO({
        _id: user._id,
        email: user.email,
        username: data.username,
        age: data.age,
        height: data.height,
        weight: data.weight,
        target: data?.target,
      });
    } catch (err) {
      throw new ResponseException(err.message, err.status, err.trace);
    }
  }
}
