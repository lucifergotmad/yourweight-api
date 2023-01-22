import { Module } from "@nestjs/common";
import { WeightRepositoryModule } from "src/modules/weight/database/weight.repository.module";
import { UserRepositoryModule } from "../database/user.repository.module";
import { userUseCaseProvider } from "./user.use-case.provider";

@Module({
  imports: [UserRepositoryModule, WeightRepositoryModule],
  exports: userUseCaseProvider,
  providers: userUseCaseProvider,
})
export class UserUseCaseModule {}
