export interface INodemailerUtil {
  sendVerificationEmail(
    username: string,
    email: string,
    confirmationCode: string,
  ): Promise<string>;
}
