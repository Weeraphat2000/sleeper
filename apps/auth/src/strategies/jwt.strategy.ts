import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
// import { Request } from 'express';
import { ToekenPayload } from '../interfaces/token-payload.interface';
import { log } from 'console';

// Local Strategy (LocalStrategy) โดยปกติถูกใช้เพื่อ รับข้อมูล username/password (หรือ email/password) จาก request เพื่อทำการ login (ตรวจสอบ username/password) แบบง่าย ๆ บนเซิร์ฟเวอร์โดยตรง
// JWT Strategy (JwtStrategy) มักใช้หลังจากที่ผู้ใช้ login สำเร็จและได้รับ JWT เพื่อยืนยันตัวตนใน request ถัด ๆ ไป โดยจะตรวจสอบ token (JWT) ว่า valid หรือไม่ และดึงข้อมูลผู้ใช้ (payload) มาใช้งาน
// โดยสรุป

// LocalStrategy: ใช้สำหรับ login (ตรวจสอบ username/password) ครั้งแรก
// JwtStrategy: ใช้ ตรวจสอบ JWT ที่ฝังมาใน request (Header หรือ Cookie) เวลาเรียกใช้งาน API หลังจาก login สำเร็จแล้วครับ!

@Injectable()
// สร้าง JwtStrategy โดยใช้ PassportStrategy และกำหนด strategy เป็น 'jwtnaa' (ถ้าไม่ใส่อะไร default 'jwt')
export class JwtStrategy extends PassportStrategy(Strategy, 'jwtnaa') {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      // jwtFromRequest จะดึง token จาก request ที่ส่งมา โดยในที่นี้จะดึงจาก request ที่ส่งมาใน cookie ที่ชื่อว่า Authentication
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication || request?.Authentication, // request?.Authentication จาก TCP
      ]),

      // ExtractJwt.fromAuthHeaderAsBearerToken() จะดึง token จาก Authorization header และตัด Bearer ออก
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // secretOrKey คือ secret key ที่ใช้ในการ verify token configService.get('JWT_SECRET') คือการดึงค่าจาก environment(.env) variable ที่ชื่อว่า JWT_SECRET
      secretOrKey: configService.get<'string'>('JWT_SECRET'),
    });
  }

  // ถ้า JWT ถูกต้อง ก็จะ decode payload → เรียก validate({ userId }) ใน JwtStrategy
  async validate(payload: ToekenPayload) {
    log('JwtStrategy.validate', payload);

    // จะ return user ออกไปให้ Passport ใช้งานต่อ
    // passport จะสร้าง key user ใน request (request.user) ให้ Passport ใช้งานต่อ
    const user = await this.userService.getUser({ _id: payload.userId });
    log('useruseruser', user);
    delete user.password;
    return {
      ...user,
      message: 'return ตรงนี้จะสร้าง key user เพื่อส่งไป controller ต่อไป',
    };
  }
}

// JWT Strategy ที่กำหนด jwtFromRequest: ExtractJwt.fromExtractors(...) จะตรวจสอบ request.cookies.Authentication ว่ามี JWT หรือไม่
// ถ้ามี มันจะทำการ verify (ตรวจสอบ signature) ด้วย secretOrKey
// ถ้าตรวจสอบผ่าน passport-jwt จะถอดค่า payload ออกมา (ตัวอย่างคือ { userId })
// จากนั้นจะเรียกเมธอด validate(payload) โดยส่ง payload เป็นพารามิเตอร์ตัวแรก
// ในโค้ดของคุณ เมธอด validate({ userId }: ToekenPayload) จะได้ { userId } เพื่อไปหาข้อมูล User ตัวเต็ม แล้ว return คืนให้ Passport ซึ่งสุดท้าย Passport จะผูก user ที่ได้ไว้ใน request.user เพื่อใช้ในขั้นตอนถัดไปของ NestJS ครับ!
