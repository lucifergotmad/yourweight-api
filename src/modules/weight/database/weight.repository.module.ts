import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WeightModel } from "./model/weight.mongo-entity";
import { weightRepositoryProvider } from "./weight.repository.provider";

@Module({
  imports: [MongooseModule.forFeature(WeightModel)],
  providers: [weightRepositoryProvider],
  exports: [weightRepositoryProvider],
})
export class WeightRepositoryModule {}
