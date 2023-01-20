export interface IEncryptorUtil {
  _encryptASCII(text: any): string;
  _decryptASCII(text: any): string | boolean;
  _hexEncode(char: number): string;
  _hexDecode(char: any): number;
  _char(ascii: number): string;
  doEncrypt(dataBeforeCopy: any, ignore: string[]): any;
  doDecrypt(dataBeforeCopy: any, ignore: string[]): any;
}
