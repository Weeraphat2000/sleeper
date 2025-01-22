import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('') // จัดกลุ่ม (tag) ใน Swagger
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    log(`ASSA: ${this.configService.get<string>('ASSA')}`); // จะดึงค่ามาจาก environment(.env) variable ที่ชื่อว่า ASSA
    return this.authService.getHello();
  }
}
