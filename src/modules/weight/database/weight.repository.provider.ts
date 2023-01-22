import { Inject, Provider } from "@nestjs/common";
import { WeightRepository } from "./weight.repository.service";

export const InjectWeightRepository = Inject(WeightRepository.name);

export const weightRepositoryProvider: Provider = {
  provide: WeightRepository.name,
  useClass: WeightRepository,
};
