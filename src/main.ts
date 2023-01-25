import { Logger, NestApplicationOptions, ValidationPipe } from "@nestjs/common";
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";
import * as helmet from "helmet";
import { resolve } from "path";
import { AppModule } from "./app.module";
import { AllExceptionFilter } from "./core/filters/http-exception.filter";
import { CustomLogger } from "./infra/logger/logger";

async function bootstrap() {
  const isSecure = !!Number(process.env.SECURE);
  const secureOptions: NestApplicationOptions = generateSecureOption(isSecure);

  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
    cors: true,
    ...secureOptions,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix("api");

  const swaggerOption = generateSwaggerOption();
  const document = SwaggerModule.createDocument(app, swaggerOption);
  SwaggerModule.setup("api/docs", app, document);

  app.use(helmet());

  app.useGlobalFilters(new AllExceptionFilter());

  const port = process.env.PORT;
  const host = "0.0.0.0";
  const logger = new Logger("NestBoilerplate");

  await app.listen(port, host, () =>
    logger.log(
      `Application started at port: ${port}, isSecure: ${isSecure} 🚀️`,
    ),
  );
}

/**
 *
 * @returns return HttpsOptions Object which is part parameter of NestApplicationOptions
 */
function generateSecureOption(secure: boolean): NestApplicationOptions {
  if (secure) {
    /**
     * Enter Your Https Certificate using below code
     *
     * @hint make sure you set 'SECURE' field in env file to 1
     * @tips recommended for absolute root path (/)
     * @optional __dirname + path/to/file
     */

    const privateKey = fs.readFileSync(
      resolve("/home/nodeapp/cert/private.key"),
      "utf-8",
    );
    const certificate = fs.readFileSync(
      resolve("/home/nodeapp/cert/certificate.crt"),
      "utf-8",
    );

    const credentials: HttpsOptions = {
      key: privateKey,
      cert: certificate,
      passphrase: "??",
    };
    return { httpsOptions: credentials };
  }
  return {};
}

function generateSwaggerOption(): Omit<OpenAPIObject, "components" | "paths"> {
  return new DocumentBuilder()
    .setTitle("YourWeight API Documentation")
    .setDescription("Concise documentation about YourWeight API")
    .setVersion("1.5")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "JWT",
    )
    .build();
}
bootstrap();
