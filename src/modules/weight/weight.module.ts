import { Module } from "@nestjs/common";
import { WeightRepositoryModule } from "./database/weight.repository.module";
import { WeightUseCaseModule } from "./use-cases/weight.use-case.module";
import { WeightController } from "./controller/weight.controller";
import { WeightCardUseCaseModule } from "../weight-card/use-cases/weight-card.use-case.module";

@Module({
  imports: [
    WeightUseCaseModule,
    WeightCardUseCaseModule,
    WeightRepositoryModule,
  ],
  controllers: [WeightController],
})
export class WeightModule {}
