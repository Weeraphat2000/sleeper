import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { log } from 'console';

// Local Strategy (LocalStrategy) โดยปกติถูกใช้เพื่อ รับข้อมูล username/password (หรือ email/password) จาก request เพื่อทำการ login (ตรวจสอบ username/password) แบบง่าย ๆ บนเซิร์ฟเวอร์โดยตรง
// JWT Strategy (JwtStrategy) มักใช้หลังจากที่ผู้ใช้ login สำเร็จและได้รับ JWT เพื่อยืนยันตัวตนใน request ถัด ๆ ไป โดยจะตรวจสอบ token (JWT) ว่า valid หรือไม่ และดึงข้อมูลผู้ใช้ (payload) มาใช้งาน
// โดยสรุป

// LocalStrategy: ใช้สำหรับ login (ตรวจสอบ username/password) ครั้งแรก
// JwtStrategy: ใช้ ตรวจสอบ JWT ที่ฝังมาใน request (Header หรือ Cookie) เวลาเรียกใช้งาน API หลังจาก login สำเร็จแล้วครับ!

@Injectable()
// สร้าง LocalStrategy โดยใช้ PassportStrategy และกำหนด strategy เป็น 'localna' (ถ้าไม่ใส่อะไร default 'local')
export class LocalStrategy extends PassportStrategy(Strategy, 'localna') {
  // import users service มาใช้งาน
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email', // คือ เช็คว่า req.body.email มีค่าหรือไม่ ถ้ามีจะเอาไปใส่ใน function validate parameter แรก (default คือ 'username'(คือ เช็คว่า req.body.username มีค่าหรือไม่ ถ้ามีก็ใส่ใน function validate parameter แรก))
      // passwordField: 'pass', // คือ เช็คว่า req.body.pass มีค่าหรือไม่ ถ้ามีจะเอาไปใส่ใน function validate parameter ที่สอง (default คือ 'password'(คือ เช็คว่า req.body.password มีค่าหรือไม่ ถ้ามีก็ใส่ใน function validate parameter ที่สอง))
    });
  }

  // สร้าง validate method สำหรับตรวจสอบข้อมูล email และ password ที่รับเข้า
  async validate(email: string, password: string) {
    try {
      log('LocalStrategy.validate', email, password);
      log('1LocalStrategy.validate', email, password);
      const user = await this.usersService.verifyUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      delete user.password;

      // จะ return user ออกไปให้ Passport ใช้งานต่อ
      // ส่งไปให้ LocalAuthGuard ใช้งานต่อ
      // decode จะได้ใช้ใน CurrentUser decorator
      return user;
      // ใน NestJS เมื่อใช้ Passport ร่วมกับ LocalStrategy (หรือกลไกอื่นของ Passport) แล้ว เราคืนค่า (return) user จากเมธอด validate(...) ได้สำเร็จ Passport จะผูก (attach) user นั้นลงใน request.user โดยอัตโนมัติ ซึ่งเป็นพฤติกรรมพื้นฐานของ Passport ครับ
    } catch (error) {
      console.error('LocalStrategy.validate error', error);
      throw new UnauthorizedException(error);
    }
  }
}
