import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { ToekenPayload } from './interfaces/token-payload.interface';
import { User } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello AuthAuthAuthAuth AuthAuthAuthAuth!';
  }

  async login(user: User, res: Response) {
    log('AuthService.login', user);

    const payload: ToekenPayload = {
      userId: user.id,
    };

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const token = this.jwtService.sign(payload);
    res.cookie('Authentication', token, { httpOnly: true, expires });

    return token;
  }
}
