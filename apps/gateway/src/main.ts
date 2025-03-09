import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { setApp } from './app';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useLogger(app.get(Logger)); // จะได้เห็น log จาก pino ที่เราใช้
  const consfigService = app.get(ConfigService);

  const port = consfigService.getOrThrow('PORT');
  log(`Server is running on port ${port}`);
  await app.listen(port);
  setApp(app);
}
bootstrap();
