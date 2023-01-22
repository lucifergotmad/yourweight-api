import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request } from "express";
import { EncryptorUtil } from "src/core/utils/modules/encryptor/encryptor.service";
import { EnvService } from "src/infra/configs/env.service";

@Injectable()
export class DecryptorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isEnc = Number(req.headers.enc || "0");
    const ignoreFields = JSON.parse(String(req.headers.ignore || "[]"));
    const encryptor = new EncryptorUtil(new EnvService(new ConfigService()));
    if (isEnc) {
      req.body = encryptor.doDecrypt(req.body, ignoreFields);
      next();
    } else {
      next();
    }
  }
}
