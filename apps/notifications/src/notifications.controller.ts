import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { log } from 'console';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('get-notifications')
  async handleNotification() {
    return this.notificationsService.getHello();
  }

  @UsePipes(new ValidationPipe())
  @EventPattern('notify-email')
  async handleEmailNotification(@Payload() payload: NotifyEmailDto) {
    log('Sending email notification', payload);
    return this.notificationsService.notifyEmail(payload);
  }
}
