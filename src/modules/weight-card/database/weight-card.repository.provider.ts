import { Inject, Provider } from "@nestjs/common";
import { WeightCardRepository } from "./weight-card.repository.service";

export const InjectWeightCardRepository = Inject(WeightCardRepository.name);

export const weightCardRepositoryProvider: Provider = {
  provide: WeightCardRepository.name,
  useClass: WeightCardRepository,
};
