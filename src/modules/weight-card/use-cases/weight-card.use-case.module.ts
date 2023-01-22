import { Module } from "@nestjs/common";
import { WeightCardRepositoryModule } from "../database/weight-card.repository.module";
import { weightCardUseCaseProvider } from "./weight-card.use-case.provider";

@Module({
  imports: [WeightCardRepositoryModule],
  exports: weightCardUseCaseProvider,
  providers: weightCardUseCaseProvider,
})
export class WeightCardUseCaseModule {}
