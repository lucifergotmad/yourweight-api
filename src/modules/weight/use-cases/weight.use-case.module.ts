import { Module } from "@nestjs/common";
import { WeightCardRepositoryModule } from "src/modules/weight-card/database/weight-card.repository.module";
import { WeightRepositoryModule } from "../database/weight.repository.module";
import { weightUseCaseProvider } from "./weight.use-case.provider";

@Module({
  imports: [WeightRepositoryModule, WeightCardRepositoryModule],
  exports: weightUseCaseProvider,
  providers: weightUseCaseProvider,
})
export class WeightUseCaseModule {}
