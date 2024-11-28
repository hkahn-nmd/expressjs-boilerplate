import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/core/app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { GlobalExceptionFilter } from './core/exceptions/globalExcetionFilters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are present
      transform: true, // Transforms the request payload into the DTO instance
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI, // Adds /v1, /v2, etc. as part of the URI
  });

  // Retrieve app configuration values
  const port = configService.get<number>('app.port'); // Accessing 'port' from appConfig
  const env = configService.get<string>('app.env'); // Accessing 'env' from appConfig

  await app.listen(port ?? 3000);
  console.log(
    `App\x1b[0m (env: \x1b[33m${env}\x1b[0m) is running on port \x1b[33m${port}\x1b[0m`,
  );
}
bootstrap();
