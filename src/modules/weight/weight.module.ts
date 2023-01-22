import { Module } from "@nestjs/common";
import { WeightRepositoryModule } from "./database/weight.repository.module";
import { WeightUseCaseModule } from "./use-cases/weight.use-case.module";
import { WeightController } from "./controller/weight.controller";

@Module({
  imports: [WeightUseCaseModule, WeightRepositoryModule],
  controllers: [WeightController],
})
export class WeightModule {}
