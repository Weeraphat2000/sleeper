import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import { ApiBody } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, UserDocument } from '@app/common';

// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('') // จัดกลุ่ม (tag) ใน Swagger
@Controller('')
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

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'hun@gmail.com',
        },
        password: {
          type: 'string',
          example: 'Pass123&',
        },
      },
    },
  })
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    log('AuthController.login', user);
    log('reqUser', req.user);
    await this.authService.login(user, res);
    res.send(user);

    // const token = this.authService.login(user);
    // res.cookie('token', token, { httpOnly: true });
    // return user;
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    log('AuthController.authenticate', data);
    log('AuthController.authenticate.user', data.user);

    return data.user;
  }
}
