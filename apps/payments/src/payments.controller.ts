import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common/dto/create-charge.dto';
import { log } from 'console';

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
    data: CreateChargeDto,
  ) {
    log('PaymentsController.createCharge', data);
    return this.paymentsService.createCharge(data);
  }
}
