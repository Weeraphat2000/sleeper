import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import testConfig from './test-config';

@Module({
  controllers: [HealthController],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.local'],
      load: [testConfig],
    }),
  ],
})
export class HealthModule {}
