import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello AuthAuth!';
  }

  async login(user: UserDocument, res: Response) {
    log('AuthService.login', user);

    const payload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const token = this.jwtService.sign(payload);
    res.cookie('token', token, { httpOnly: true, expires });
  }
}
