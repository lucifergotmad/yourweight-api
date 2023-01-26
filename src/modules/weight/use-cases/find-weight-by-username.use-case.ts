import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { WeightResponseDTO } from "../controller/dtos/weight.response.dto";
import { WeightRepositoryPort } from "../database/weight.repository.port";
import { InjectWeightRepository } from "../database/weight.repository.provider";

@Injectable()
export class FindWeightByUsername
  extends BaseUseCase
  implements IUseCase<never, WeightResponseDTO>
{
  constructor(
    @InjectWeightRepository
    private readonly weightRepository: WeightRepositoryPort,
  ) {
    super();
  }

  public async execute(): Promise<WeightResponseDTO> {
    try {
      const { weight, target = 0 } = await this.weightRepository.findOneLatest({
        username: this.user.username,
      });

      return new WeightResponseDTO({ weight, target });
    } catch (error) {
      throw new ResponseException(error.message, error.status, error.trace);
    }
  }
}
