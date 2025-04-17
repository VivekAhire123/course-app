import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    const config = new DocumentBuilder()
      .setTitle('Learning Platform API')
      .setDescription('API for managing courses and users')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'Authorization',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('course', app, document);
  }

  const port = process.env.PORT ?? 3005;
  const host = 'localhost';
  await app.listen(port);
  console.log(`Server listening at: http://${host}:${port}`);
}
bootstrap();
