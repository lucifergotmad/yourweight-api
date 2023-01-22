import { Module } from "@nestjs/common";
import { WeightRepositoryModule } from "../database/weight.repository.module";
import { weightUseCaseProvider } from "./weight.use-case.provider";

@Module({
  imports: [WeightRepositoryModule],
  exports: weightUseCaseProvider,
  providers: weightUseCaseProvider,
})
export class WeightUseCaseModule {}
