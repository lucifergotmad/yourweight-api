import { Module } from "@nestjs/common";
import { WeightCardRepositoryModule } from "./database/weight-card.repository.module";
import { WeightCardUseCaseModule } from "./use-cases/weight-card.use-case.module";

@Module({
  imports: [WeightCardUseCaseModule, WeightCardRepositoryModule],
  controllers: [],
})
export class WeightCardModule {}
