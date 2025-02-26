import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('MYSQL_HOST'),
        port: configService.getOrThrow('MYSQL_PORT'),
        database: configService.getOrThrow('MYSQL_DATABASE'),
        username: configService.getOrThrow('MYSQL_USERNAME'),
        password: configService.getOrThrow('MYSQL_PASSWORD'),
        synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'), // configService.get('MYSQL_SYNCHRONIZE', false) คือ ถ้าไม่มีค่า MYSQL_SYNCHRONIZE ให้ใช้ค่า false
        autoLoadEntities: true,

        // type: 'mysql',
        // host: 'mysql',
        // port: 3306,
        // database: 'sleeper',
        // username: 'root',
        // password: 'randompassword',
        // autoLoadEntities: true,
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
