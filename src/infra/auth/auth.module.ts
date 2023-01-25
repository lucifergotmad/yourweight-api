import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserRepositoryModule } from "src/modules/user/database/user.repository.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { EnvService } from "../configs/env.service";
import { EnvModule } from "../configs/env.module";
import { JwtStrategy } from "./jwt.strategy";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    UserRepositoryModule,
    PassportModule,
    EnvModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client"),
      exclude: ["/api*"],
    }),
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
