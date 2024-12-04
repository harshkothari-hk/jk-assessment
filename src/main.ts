import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('JK Microservices')
    .setDescription('Api JK Service')
    .setVersion('1.0.0')
    // .addSecurity('ApiKey', {
    //   type: 'apiKey',
    //   in: 'header',
    //   name: 'x-api-key',
    // })
    // .addSecurityRequirements('ApiKey', [])
    .build();
  
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api/swagger', app, document);

  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port).then(() => {
    console.log(`Application is running on: http://localhost:${port}`);
  }).catch((error) => {
    console.error('Error while starting application', error)
  });
}
bootstrap();
