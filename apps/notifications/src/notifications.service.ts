import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { log } from 'console';

@Injectable()
export class NotificationsService {
  getHello(): string {
    return 'Hello Notifications';
  }

  async notifyEmail({ email }: NotifyEmailDto) {
    log('email notification sent', email);
  }
}
