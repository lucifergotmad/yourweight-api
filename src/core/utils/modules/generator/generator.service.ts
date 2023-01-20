import { Injectable } from "@nestjs/common";
import { IGeneratorUtil } from "./generator.interface";

@Injectable()
export class GeneratorUtil implements IGeneratorUtil {
  generateRandomString(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
