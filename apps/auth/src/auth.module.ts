import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from '@app/common/logger/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HealthModule } from '@app/common';

@Module({
  imports: [
    UsersModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(), // configModule จะต้องมี MONGODB_URI
        JWT_SECRET: Joi.string().required(), // configModule จะต้องมี JWT_SECRET
        JWT_EXPIRATION: Joi.string().required(), // configModule จะต้องมี JWT_EXPIRATION
        HTTP_PORT: Joi.number().required(), // configModule จะต้องมี PORT
        // HTTP_PORT: Joi.number().default(3001), // configModule จะมี PORT และ default ค่าเป็น 3001
        TCP_PORT: Joi.number().required(), // configModule จะต้องมี TCP_PORT
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService], // ต้อง inject ConfigService เข้ามาด้วย
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // ใช้ JWT_SECRET จาก configModule
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'), // ใช้ JWT_EXPIRATION จาก configModule
        },
      }),
    }),
    HealthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
