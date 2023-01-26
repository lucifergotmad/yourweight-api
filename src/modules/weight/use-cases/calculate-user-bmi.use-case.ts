import { Injectable } from "@nestjs/common";
import { BaseUseCase } from "src/core/base-classes/infra/use-case.base";
import { IUseCase } from "src/core/base-classes/interfaces/use-case.interface";
import { BMI } from "src/core/constants/app/bmi.const";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { BMIResponseDTO } from "../controller/dtos/bmi.response.dto";
import { WeightRepositoryPort } from "../database/weight.repository.port";
import { InjectWeightRepository } from "../database/weight.repository.provider";

@Injectable()
export class CalculateUserBMI
  extends BaseUseCase
  implements IUseCase<never, BMIResponseDTO>
{
  constructor(
    @InjectWeightRepository
    private readonly weightRepository: WeightRepositoryPort,
  ) {
    super();
  }

  public async execute(): Promise<BMIResponseDTO> {
    try {
      const { weight, height } = await this.weightRepository.findOneLatest({
        username: this.user.username,
      });

      const calculatedWeight = this.calculate(weight, height);
      const description = this.defineBMI(calculatedWeight);

      return new BMIResponseDTO({ description, index: calculatedWeight });
    } catch (error) {
      throw new ResponseException(error.message, error.status, error.trace);
    }
  }

  private calculate(weight: number, height: number): number {
    return +(weight / height).toFixed(1);
  }

  private defineBMI(calculatedWeight: number): string {
    let response: string;
    if (calculatedWeight < 16) {
      response = BMI.SevereThinness;
    } else if (calculatedWeight <= 17) {
      response = BMI.ModerateThinness;
    } else if (calculatedWeight <= 18.5) {
      response = BMI.MildThinness;
    } else if (calculatedWeight <= 25) {
      response = BMI.Normal;
    } else if (calculatedWeight <= 30) {
      response = BMI.Overweight;
    } else if (calculatedWeight <= 35) {
      response = BMI.ObeseClass1;
    } else if (calculatedWeight <= 40) {
      response = BMI.ObeseClass2;
    } else {
      response = BMI.ObeseClass3;
    }
    return response;
  }
}
