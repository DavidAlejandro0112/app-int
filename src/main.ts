import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
    
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })

  );

    const config = new DocumentBuilder()
    .setTitle('App-int')
    .setDescription('App integradora')
    .setVersion('1.0') 
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

    const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3003
  await app.listen(port);
  console.log(`App listen for port ${port}`);
}
bootstrap();