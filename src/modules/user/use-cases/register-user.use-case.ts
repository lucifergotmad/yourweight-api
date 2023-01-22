import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { Utils } from "src/core/utils/utils.service";
import { AuthRegisterRequestDTO } from "src/modules/app/controller/dtos/auth-register.dto";
import { IdResponseDTO } from "src/interface-adapter/dtos/id.response.dto";
import { UserRepositoryPort } from "../database/user.repository.port";
import { InjectUserRepository } from "../database/user.repository.provider";
import { UserEntity } from "../domain/user.entity";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { IRepositoryResponse } from "src/core/ports/interfaces/repository-response.interface";
import { WeightEntity } from "src/modules/weight/domain/weight.entity";
import { InjectWeightRepository } from "src/modules/weight/database/weight.repository.provider";
import { WeightRepositoryPort } from "src/modules/weight/database/weight.repository.port";

@Injectable()
export class RegisterUser
  extends BaseUseCase
  implements IUseCase<AuthRegisterRequestDTO, IdResponseDTO>
{
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
    @InjectWeightRepository
    private readonly weightRepository: WeightRepositoryPort,
    private readonly utils: Utils,
  ) {
    super();
  }

  public async execute(user: AuthRegisterRequestDTO): Promise<IdResponseDTO> {
    const session = await this.utils.transaction.startTransaction();
    let result: IRepositoryResponse;

    try {
      await session.withTransaction(async () => {
        await this.userRepository.findOneAndThrow(
          {
            email: user.email,
            username: user.username,
          },
          "Username or Email are already use",
        );

        const confirmationCode = this.utils.generator.generateRandomString(16);

        const userEntity = await UserEntity.create({
          confirmationCode,
          password: user.password,
          username: user.username,
          email: user.email,
          is_confirmed: false,
        });

        result = await this.userRepository.save(userEntity, session);

        const weightEntity = WeightEntity.create({
          username: user.username,
          weight: user.weight,
          height: user.height,
          age: user.height,
        });

        await this.weightRepository.save(weightEntity, session);

        await this.utils.nodemailer.sendVerificationEmail(
          user.username,
          user.email,
          confirmationCode,
        );
      });

      return new IdResponseDTO(result._id);
    } catch (err) {
      throw new ResponseException(err.message, err.status, err.trace);
    } finally {
      session.endSession();
    }
  }
}
