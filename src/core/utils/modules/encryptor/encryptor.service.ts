import { Injectable } from "@nestjs/common";
import { EnvService } from "src/infra/configs/env.service";
import { IEncryptorUtil } from "./encryptor.interface";

@Injectable()
export class EncryptorUtil implements IEncryptorUtil {
  private encKey: string;
  private isEnc: boolean;

  constructor(private envService: EnvService) {
    this.encKey = this.envService.encKey;
    this.isEnc = this.envService.isEnc;
  }

  _encryptASCII(text: any) {
    const key = this.encKey;
    const dataKey: any = {};

    for (let i = 0; i < key.length; i++) {
      dataKey[i] = key.substring(i, 1);
    }

    let strEnc = "";
    let nkey = 0;
    const jumlah = text.length;

    for (let i = 0; i < parseInt(jumlah); i++) {
      strEnc =
        strEnc +
        this._hexEncode(text[i].charCodeAt(0) + dataKey[nkey].charCodeAt(0));

      if (nkey === Object.keys(dataKey).length - 1) {
        nkey = 0;
      }
      nkey = nkey + 1;
    }

    return strEnc.toUpperCase();
  }

  _decryptASCII(str: any) {
    if (str) {
      const key = this.encKey;
      const dataKey: any = {};
      for (let i = 0; i < key.length; i++) {
        dataKey[i] = key.substring(i, 1);
      }

      let stringDecrypted = "";
      let nkey = 0;
      let i = 0;

      const jumlah = str.length;

      while (i < parseInt(jumlah)) {
        stringDecrypted =
          stringDecrypted +
          this._char(
            this._hexDecode(str.substr(i, 2)) - dataKey[nkey].charCodeAt(0),
          );
        if (nkey === Object.keys(dataKey).length - 1) {
          nkey = 0;
        }
        nkey = nkey + 1;
        i = i + 2;
      }
      return stringDecrypted;
    }
    return true;
  }

  _hexEncode(str: number) {
    const result = str.toString(16);
    return result;
  }

  _hexDecode(hex: string) {
    const result = parseInt(hex, 16);
    return result;
  }

  _char(asci: number) {
    const result = String.fromCharCode(asci);
    return result;
  }

  doEncrypt(dataBeforeCopy: any, ignore: string[] = []) {
    if (!this.isEnc) {
      console.log("masuk");

      return dataBeforeCopy;
    }

    if (!dataBeforeCopy) {
      return dataBeforeCopy;
    }

    if (
      typeof dataBeforeCopy === "object" &&
      !(dataBeforeCopy instanceof Date)
    ) {
      const data = Array.isArray(dataBeforeCopy)
        ? [...dataBeforeCopy]
        : { ...dataBeforeCopy };
      Object.keys(data).map((x: any) => {
        const result = ignore.find((find: any) => find === x);
        if (!result) {
          if (Array.isArray(data[x])) {
            data[x] = data[x].map((y: any) => {
              if (typeof y === "string") {
                return this._encryptASCII(y);
              } else if (
                typeof data[x] === "object" &&
                data[x] &&
                !(data[x] instanceof Date)
              ) {
                return this.doEncrypt(y, ignore);
              }
              return false;
            });
          } else {
            if (typeof data[x] === "string" && data[x]) {
              data[x] = this._encryptASCII(data[x]);
            } else if (typeof data[x] === "number" && data[x]) {
            } else if (
              typeof data[x] === "object" &&
              data[x] &&
              !(dataBeforeCopy instanceof Date)
            ) {
              data[x] = this.doEncrypt(data[x], ignore);
            }
          }
        }
        return false;
      });
      return data;
    } else if (typeof dataBeforeCopy === "string") {
      const data = this._encryptASCII(dataBeforeCopy);
      return data;
    }
    return dataBeforeCopy;
  }

  doDecrypt(dataBeforeCopy: any, ignore: string[] = []) {
    if (!this.isEnc) {
      return dataBeforeCopy;
    }

    if (!dataBeforeCopy) {
      return dataBeforeCopy;
    }

    if (
      typeof dataBeforeCopy === "object" &&
      !(dataBeforeCopy instanceof Date)
    ) {
      const data = Array.isArray(dataBeforeCopy)
        ? [...dataBeforeCopy]
        : { ...dataBeforeCopy };
      Object.keys(data).map((x: any) => {
        const result = ignore.find((find: any) => find === x);
        if (!result) {
          if (Array.isArray(data[x])) {
            data[x] = data[x].map((y: any) => {
              if (typeof y === "string") {
                return this._decryptASCII(y);
              } else if (
                typeof data[x] === "object" &&
                data[x] &&
                !(data[x] instanceof Date)
              ) {
                return this.doDecrypt(y, ignore);
              }
              return false;
            });
          } else {
            if (typeof data[x] === "string" && data[x]) {
              data[x] = this._decryptASCII(data[x]);
            } else if (typeof data[x] === "number" && data[x]) {
            } else if (
              typeof data[x] === "object" &&
              data[x] &&
              !(dataBeforeCopy instanceof Date)
            ) {
              data[x] = this.doDecrypt(data[x], ignore);
            }
          }
        }
        return false;
      });
      return data;
    } else if (typeof dataBeforeCopy === "string") {
      const data = this._decryptASCII(dataBeforeCopy);
      return data;
    }
  }
}
