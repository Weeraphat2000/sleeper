import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(), // เพื่อให้ MONGODB_URI ไม่สามารถเป็นค่าว่างได้ จะแจ้ง error ถ้าไม่ได้กำหนดค่า
        // เอาค่าจากไฟล์ .env มาใช้งาน
        // PORT: Joi.number().default(3000), // ถ้าไม่ได้กำหนดค่า PORT จะใช้ค่า 3000 แทน
        // PORT: Joi.number().required(), // ถ้าไม่ได้กำหนดค่า PORT จะแจ้ง error ถ้าไม่ได้กำหนดค่า
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
