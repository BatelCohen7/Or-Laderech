import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix(config.apiPrefix);

  // CORS
  app.enableCors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','),
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Cookie parser
  app.use(cookieParser());

  // Swagger/OpenAPI
  if (!config.isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Or LaDerech API')
      .setDescription('Urban Renewal Platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer(`/${config.apiPrefix}`, 'API v1')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${config.apiPrefix}/docs`, app, document);
  }

  await app.listen(config.port);
  console.log(`Application is running on: http://localhost:${config.port}/${config.apiPrefix}`);
  if (!config.isProduction) {
    console.log(`Swagger docs available at: http://localhost:${config.port}/${config.apiPrefix}/docs`);
  }
}

bootstrap();
