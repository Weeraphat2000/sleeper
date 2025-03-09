import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@app/common/logger/logger.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';
import { authContext } from './auth.context';
import { log } from 'console';

@Module({
  imports: [
    // 1) ConfigModule: โหลด module สำหรับจัดการ environment variables ให้เป็น global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2) LoggerModule: module จัดการ logger แบบ custom ที่เราเขียนไว้ใช้เอง
    LoggerModule, // จริงๆสามารถ import เข้ามาใช้ได้เลย แต่ว่าทำเป็น module ไว้ใช้ในที่อื่นง่ายขึ้น

    // 3) GraphQLModule: ตั้งค่าการใช้งาน Apollo Gateway (Federation) แทนที่จะเป็น Apollo Server ปกติ
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // server: ตรงนี้สามารถตั้งค่าของ Apollo Server ได้ ซึ่งเราตั้งค่า context ให้เป็นฟังก์ชัน authContext
        // จะมาเรียกใช้ตรงนี้ก่อนทุกครั้งที่มี request ส่งเข้ามา
        server: {
          context: authContext,
        },
        // gateway: ตั้งค่าของ Apollo Gateway
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'reservations',
                url: configService.getOrThrow<string>(
                  'RESERVATIONS_GRAPHQL_URL',
                ),
              },
              {
                name: 'auth',
                url: configService.getOrThrow<string>('AUTH_GRAPHQL_URL'),
              },
              {
                name: 'payments',
                url: configService.getOrThrow<string>('PAYMENTS_GRAPHQL_URL'),
              },
              // หากมี microservice อื่น ๆ ที่ต้องการรวมเข้ามา ก็ใส่ได้ที่นี่
            ],
          }),
          // buildService: ใช้เพื่อ override behavior default ของ RemoteGraphQLDataSource
          // เราสามารถแก้ไข request ก่อนส่ง (เช่น แนบ headers เพิ่ม) ผ่าน willSendRequest
          buildService({ url }) {
            return new RemoteGraphQLDataSource({
              url,
              // willSendRequest: ฟังก์ชันที่จะถูกเรียกทุกครั้งก่อน request ถูกส่งจาก Gateway ไปยัง Service
              willSendRequest({ request, context }) {
                log('willSendRequest', context);
                // ในที่นี้จะส่งค่าของ user (context.user) แปลงเป็น string ใส่ใน header 'user'
                // เพื่อใช้เป็นข้อมูลยืนยันตัวตน หรืออ้างอิงผู้ใช้งานใน Service ปลายทาง

                // หลังจากการทำงานของ server เสร็จ จะ return ค่ากลับไปที่ context ของ server
                // และก็เอา set ค่าใน header ไปใช้ใน Service
                request.http.headers.set(
                  'user',
                  context.user ? JSON.stringify(context.user) : null,
                );
              },
            });
          },
        },
      }),
    }),

    // 4) ClientsModule: ใช้งาน Microservices ของ NestJS เพื่อเชื่อมกับ AUTH_SERVICE
    //    โดย transport = TCP และดึง host, port จาก .env (ผ่าน ConfigService)
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('AUTH_HOST'),
            port: configService.getOrThrow<number>('AUTH_PORT'),
          },
        }),
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
