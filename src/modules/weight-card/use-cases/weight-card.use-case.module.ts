import { Module } from "@nestjs/common";
import { WeightRepositoryModule } from "src/modules/weight/database/weight.repository.module";
import { WeightCardRepositoryModule } from "../database/weight-card.repository.module";
import { weightCardUseCaseProvider } from "./weight-card.use-case.provider";

@Module({
  imports: [WeightCardRepositoryModule, WeightRepositoryModule],
  exports: weightCardUseCaseProvider,
  providers: weightCardUseCaseProvider,
})
export class WeightCardUseCaseModule {}
