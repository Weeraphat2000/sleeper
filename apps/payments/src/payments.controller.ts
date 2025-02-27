import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { log } from 'console';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('getHello')
  getHello(@Ctx() context: RmqContext) {
    log('PaymentsController.getHello');
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    // throw new Error('test error');
    channel.ack(originalMsg); // ใช้ ack เพื่อยืนยันว่า message ถูกส่งไปถึง service แล้ว
    // ถ้าไม่ใช้ ack แล้ว service ไม่ได้รับ message หรือ message ไม่ถูกส่งไปถึง service จะทำให้ message นั้นไม่ถูกลบออกจาก queue และจะถูกส่งไปยัง service อีกครั้ง
    // มันขึ้นอยู่กับ queue ที่ config ไว้ที่ payments.module.ts (ack == false)
    return this.paymentsService.getHello();
  }

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload()
    data: PaymentsCreateChargeDto,
    @Ctx() context: RmqContext,
  ) {
    log('PaymentsController.createCharge', data);
    // *****
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    log('originalMsgoriginalMsg', originalMsg);

    const result = await this.paymentsService.createCharge(data);
    channel.ack(originalMsg); // ใช้ ack เพื่อยืนยันว่า message ถูกส่งไปถึง service แล้ว
    // ถ้าไม่ใช้ ack แล้ว service ไม่ได้รับ message หรือ message ไม่ถูกส่งไปถึง service จะทำให้ message นั้นไม่ถูกลบออกจาก queue และจะถูกส่งไปยัง service อีกครั้ง
    return result;
  }
}
