import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
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
  async handleEmailNotification(
    @Payload() payload: NotifyEmailDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    log('Sending email notification', payload);

    const result = await this.notificationsService.notifyEmail(payload);

    channel.ack(originalMsg);
    return result;
  }
}
