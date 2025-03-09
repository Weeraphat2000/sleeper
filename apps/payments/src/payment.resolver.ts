import { Query, Resolver } from '@nestjs/graphql';
import { PaymentIntent } from './payment-intent.entity';
import { PaymentsService } from './payments.service';

@Resolver(() => PaymentIntent)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentsService) {}

  @Query(() => [PaymentIntent], { name: 'payments' })
  async findAll() {
    return this.paymentService.getPayments();
  }
}
