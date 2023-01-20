import { Inject, Injectable } from "@nestjs/common";
import { ConnectionName } from "src/core/constants/database/connection-name.const";
import { IUtils } from "./utils.interface";
import { DateUtil } from "./modules/date/date.service";
import { TransactionUtil } from "./modules/transaction/transaction.service";
import { HashUtil } from "./modules/hash/hash.service";
import { CacheUtil } from "./modules/cache/cache.service";
import { GeneratorUtil } from "./modules/generator/generator.service";
import { NodemailerUtil } from "./modules/nodemailer/nodemailer.service";
import { EncryptorUtil } from "./modules/encryptor/encryptor.service";

@Injectable()
export class Utils implements IUtils {
  constructor(
    readonly cache: CacheUtil,
    readonly date: DateUtil,
    readonly hash: HashUtil,
    readonly generator: GeneratorUtil,
    readonly nodemailer: NodemailerUtil,
    readonly encryptor: EncryptorUtil,
    @Inject(ConnectionName.DB_PRIMARY) readonly transaction: TransactionUtil,
  ) {}
}
