export interface IEncryptorUtil {
  _encryptASCII(text: any): string;
  _decryptASCII(text: any): string | boolean;
  _hexEncode(char: any): string;
  _hexDecode(char: any): number;
  _char(ascii: any): string;
  doEncrypt(dataBeforeCopy: any, ignore: string[]): any;
  doDecrypt(dataBeforeCopy: any, ignore: string[]): any;
}
