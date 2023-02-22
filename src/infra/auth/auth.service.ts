import { Injectable } from "@nestjs/common";
import { UserMongoEntity } from "src/modules/user/database/model/user.mongo-entity";
import { UserRepository } from "src/modules/user/database/user.repository.service";
import { Utils } from "src/core/utils/utils.service";
import { JwtService } from "@nestjs/jwt";
import { AuthLoginResponseDTO } from "src/modules/app/controller/dtos/auth-login.response.dto";
import { MessageResponseDTO } from "src/interface-adapter/dtos/message.response.dto";
import { EnvService } from "../configs/env.service";
import { AuthRefreshTokenRequestDTO } from "src/modules/app/controller/dtos/auth-refresh-token.dto";
import { ExceptionUnauthorize } from "src/core/exceptions/unauthorize.exception";
import { ResponseException } from "src/core/exceptions/response.http-exception";
import { AuthLoginRequestDTO } from "src/modules/app/controller/dtos/auth-login.dto";
import { InjectUserRepository } from "src/modules/user/database/user.repository.provider";

@Injectable()
export class AuthService {
  constructor(
    @InjectUserRepository
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    private readonly utils: Utils,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<UserMongoEntity> | null> {
    const user = await this.userRepository.findOne({
      $or: [{ username }, { email: username }],
    });

    if (user) {
      const passwordMatch = await this.utils.hash.compare(
        password,
        user.password,
      );

      if (passwordMatch) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async login(body: AuthLoginRequestDTO) {
    try {
      const user = await this.userRepository.findOne({
        $or: [{ username: body.username }, { email: body.username }],
      });

      const { access_token, refresh_token } = await this.registerToken(user);

      return new AuthLoginResponseDTO({
        _id: user._id,
        accessToken: access_token,
        refreshToken: refresh_token,
        username: user.username,
      });
    } catch (error) {
      throw new ResponseException(error.response, error.status, error.trace);
    }
  }

  async logout(body: AuthRefreshTokenRequestDTO) {
    await this.utils.cache.delete(body.refresh_token);
    await this.utils.cache.delete(body.username);
    return new MessageResponseDTO("Berhasil Logout");
  }

  async registerToken(user: Partial<UserMongoEntity>) {
    const payload = { sub: user.username };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.envService.jwtLimit,
      secret: this.envService.jwtRefreshKey,
    });

    await this.utils.cache.set(user.username, true);
    await this.utils.cache.set(
      refreshToken,
      user.username,
      this.envService.jwtLimit,
    );

    return { access_token: token, refresh_token: refreshToken };
  }

  async refreshToken(body: AuthRefreshTokenRequestDTO) {
    try {
      await this._validateRefreshToken(body);

      const payload = { sub: body.username };
      const token = this.jwtService.sign(payload);
      await this.utils.cache.set(body.username, true);
      return { access_token: token };
    } catch (error) {
      throw new ResponseException(error.response, error.status, error.trace);
    }
  }

  private async _validateRefreshToken(body: AuthRefreshTokenRequestDTO) {
    const validToken = await this.utils.cache.get(body.refresh_token);
    if (!validToken || body.username !== validToken)
      throw new ExceptionUnauthorize("Invalid Refresh Token.", this);
  }
}
