import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvKey } from "../../core/constants/env/env-keys.const";

@Injectable()
export class EnvService {
  private readonly _dbConnectionURI: string;
  private readonly _dbName: string;
  private readonly _dbUsername: string;
  private readonly _dbPassword: string;
  private readonly _jwtSecretKey: string;
  private readonly _jwtRefreshKey: string;
  private readonly _jwtLimit: number;
  private readonly _mode: string;
  private readonly _secure: boolean;
  private readonly _nodemailerPassword: string;
  private readonly _nodemailerEmail: string;

  constructor(private readonly configService: ConfigService) {
    this._dbConnectionURI = this.configService.get<string>(EnvKey.DB_URI);
    this._jwtSecretKey = this.configService.get<string>(EnvKey.JWT_KEY);
    this._jwtRefreshKey = this.configService.get<string>(
      EnvKey.JWT_REFRESH_KEY,
    );
    this._mode = this.configService.get<string>(EnvKey.MODE);
    this._secure = Boolean(this.configService.get<number>(EnvKey.SECURE));
    this._dbName = this.configService.get<string>(EnvKey.DB_NAME);
    this._dbUsername = this.configService.get<string>(EnvKey.DB_USERNAME);
    this._dbPassword = this.configService.get<string>(EnvKey.DB_PASSWORD);
    this._jwtLimit = Number(
      this.configService.get<number>(EnvKey.JWT_LIMIT) || 1200,
    );
    this._nodemailerPassword = this.configService.get<string>(
      EnvKey.NODEMAILER_PASSWORD,
    );
    this._nodemailerEmail = this.configService.get<string>(
      EnvKey.NODEMAILER_EMAIL,
    );
  }

  get dbConnectionURI(): string {
    return this._dbConnectionURI;
  }

  get dbName(): string {
    return this._dbName;
  }

  get dbUsername(): string {
    return this._dbUsername;
  }

  get dbPassword(): string {
    return this._dbPassword;
  }

  get jwtSecretKey(): string {
    return this._jwtSecretKey;
  }

  get jwtRefreshKey(): string {
    return this._jwtRefreshKey;
  }

  get jwtLimit(): number {
    return this._jwtLimit;
  }

  get mode(): string {
    return this._mode;
  }

  get secure(): boolean {
    return this._secure;
  }

  get nodemailerPassword(): string {
    return this._nodemailerPassword;
  }

  get nodemailerEmail(): string {
    return this._nodemailerEmail;
  }
}
