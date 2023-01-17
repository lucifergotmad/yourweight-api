import { CacheModule, Module } from "@nestjs/common";
import { EnvModule } from "src/infra/configs/env.module";
import { CacheUtil } from "./cache/cache.service";
import { DateUtil } from "./date/date.service";
import { GeneratorUtil } from "./generator/generator.service";
import { HashUtil } from "./hash/hash.service";
import { NodemailerUtil } from "./nodemailer/nodemailer.service";
import { transactionProvider } from "./transaction/transaction.provider";

@Module({
  imports: [CacheModule.register(), EnvModule],
  providers: [
    CacheUtil,
    DateUtil,
    HashUtil,
    GeneratorUtil,
    NodemailerUtil,
    ...transactionProvider,
  ],
  exports: [
    CacheUtil,
    DateUtil,
    HashUtil,
    GeneratorUtil,
    NodemailerUtil,
    ...transactionProvider,
  ],
})
export class InitModule {}
