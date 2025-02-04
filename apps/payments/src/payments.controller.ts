import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { log } from 'console';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('getHello')
  getHello() {
    log('PaymentsController.getHello');
    return this.paymentsService.getHello();
  }

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload()
    data: PaymentsCreateChargeDto,
  ) {
    log('PaymentsController.createCharge', data);
    return this.paymentsService.createCharge(data);
  }
}
