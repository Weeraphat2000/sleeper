import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { log } from 'console';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}

  private readonly trasnport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2', // OAuth2 คือ การใช้ token แทนการใช้รหัสผ่าน
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  getHello(): string {
    return 'Hello Notifications';
  }

  async notifyEmail({ email, text }: NotifyEmailDto) {
    const mailOptions = {
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Sending Email using Node.js',
      text,
    };

    this.trasnport.sendMail(mailOptions, (error, info) => {
      if (error) {
        log('error', error);
      } else {
        log('Email sent: ' + info.response);
      }
    });
  }
}
