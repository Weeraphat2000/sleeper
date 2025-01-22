import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { log } from 'console';

@Injectable()
// สร้าง LocalStrategy โดยใช้ PassportStrategy และกำหนด strategy เป็น 'localna' (ถ้าไม่ใส่อะไร default 'local')
export class LocalStrategy extends PassportStrategy(Strategy, 'localna') {
  // import users service มาใช้งาน
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  // สร้าง validate method สำหรับตรวจสอบข้อมูล email และ password ที่รับเข้า
  async validate(email: string, password: string) {
    try {
      log('LocalStrategy.validate', email, password);
      const user = await this.usersService.verifyUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      console.error('LocalStrategy.validate error', error);
      throw new UnauthorizedException(error);
    }
  }
}
