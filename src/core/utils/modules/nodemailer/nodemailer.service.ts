import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import { Injectable } from "@nestjs/common";
import { INodemailerUtil } from "./nodemailer.interface";
import { EnvService } from "src/infra/configs/env.service";

@Injectable()
export class NodemailerUtil implements INodemailerUtil {
  private transporter: Transporter;

  constructor(private envService: EnvService) {
    this._setupNodemailer();
  }

  private _setupNodemailer() {
    this.transporter = nodemailer.createTransport({
      host: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: this.envService.nodemailerEmail,
        pass: this.envService.nodemailerPassword,
      },
    });
  }

  async sendVerificationEmail(
    username: string,
    email: string,
    confirmationCode: string,
  ): Promise<string> {
    try {
      await this.transporter.sendMail({
        from: this.envService.nodemailerEmail,
        to: email,
        subject: "Please confirm your account",
        html: `
            <div>
                <h1>Email Confirmation</h1>
                <h2>Hello, ${username}</h2>
                <p>Please confirm your email by clicking on the following link</p>
                <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
            </div>
            `,
      });

      return "Send e-mail verification succeeded";
    } catch (error) {
      return error;
    }
  }
}
