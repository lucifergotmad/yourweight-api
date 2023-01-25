import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserRepositoryModule } from "src/modules/user/database/user.repository.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { EnvService } from "../configs/env.service";
import { EnvModule } from "../configs/env.module";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    UserRepositoryModule,
    PassportModule,
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      useFactory: (envService: EnvService) => ({
        secret: envService.jwtSecretKey,
        signOptions: { expiresIn: 6000 },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
