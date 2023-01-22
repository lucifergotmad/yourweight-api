import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WeightCardModel } from "./model/weight-card.mongo-entity";
import { weightCardRepositoryProvider } from "./weight-card.repository.provider";

@Module({
  imports: [MongooseModule.forFeature(WeightCardModel)],
  providers: [weightCardRepositoryProvider],
  exports: [weightCardRepositoryProvider],
})
export class WeightCardRepositoryModule {}
