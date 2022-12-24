export class Encryptor {
  private isEncrypt: boolean;
  private encKey: string;

  constructor() {
    this.encKey = process.env.ENCKEY;
    this.isEncrypt = !!Number(process.env.ENCRYPTION_MODE);
  }

  private _encryptascii(str: string) {
    if (str) {
      const dataKey: any = {};
      for (let i = 0; i < this.encKey.length; i++) {
        dataKey[i] = this.encKey.substring(i, 1);
      }

      let encryptedString = "";
      let nkey = 0;
      const stringLength = str.length;

      for (let i = 0; i < stringLength; i++) {
        encryptedString =
          encryptedString +
          this._hexEncode(str[i].charCodeAt(0) + dataKey[nkey].charCodeAt(0));

        if (nkey === Object.keys(dataKey).length - 1) {
          nkey = 0;
        }
        nkey = nkey + 1;
      }
      return encryptedString.toUpperCase();
    }
    return true;
  }

  private _decryptascii(str: string) {
    if (str) {
      const dataKey: any = {};
      for (let i = 0; i < this.encKey.length; i++) {
        dataKey[i] = this.encKey.substring(i, 1);
      }

      let decryptedString = "";
      let nkey = 0;
      const stringLength = str.length;
      let i = 0;
      while (i < stringLength) {
        decryptedString =
          decryptedString +
          this._chr(
            this._hexDecode(str.substring(i, 2)) - dataKey[nkey].charCodeAt(0),
          );
        if (nkey === Object.keys(dataKey).length - 1) {
          nkey = 0;
        }
        nkey = nkey + 1;
        i = i + 2;
      }
      return decryptedString;
    }
    return true;
  }

  private _hexEncode(str: any) {
    let result = "";
    result = str.toString(16);
    return result;
  }

  private _hexDecode(hex: any) {
    let str: any = "";
    str = parseInt(hex, 16);
    return str;
  }

  private _chr(asci: any) {
    let str = "";
    str = String.fromCharCode(asci);
    return str;
  }

  doEncrypt(dataBeforeCopy: any, ignore: string[] = []) {
    if (!this.isEncrypt) {
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
                return this._encryptascii(y);
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
              data[x] = this._encryptascii(data[x]);
            } else if (typeof data[x] === "number" && data[x]) {
              data[x] = data[x];
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
      const data = this._encryptascii(dataBeforeCopy);
      return data;
    }
    return dataBeforeCopy;
  }

  doDecrypt(dataBeforeCopy: any, ignore: string[] = []) {
    if (!this.isEncrypt) {
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
                return this._decryptascii(y);
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
              data[x] = this._decryptascii(data[x]);
            } else if (typeof data[x] === "number" && data[x]) {
              data[x] = data[x];
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
      const data = this._decryptascii(dataBeforeCopy);
      return data;
    }
  }
}
