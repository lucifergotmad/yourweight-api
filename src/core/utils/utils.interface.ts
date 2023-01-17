import { ICacheUtil } from "./modules/cache/cache.interface";
import { IDateUtil } from "./modules/date/date.interface";
import { IGeneratorUtil } from "./modules/generator/generator.interface";
import { IHashUtil } from "./modules/hash/hash.interface";
import { INodemailerUtil } from "./modules/nodemailer/nodemailer.interface";
import { ITransactionUtil } from "./modules/transaction/transaction.interface";

export interface IUtils {
  cache: ICacheUtil;
  date: IDateUtil;
  hash: IHashUtil;
  transaction: ITransactionUtil;
  generator: IGeneratorUtil;
  nodemailer: INodemailerUtil;
}
