import { CreateChargeDto } from '@app/common/dto/create-charge.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get<string>('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2020-08-27' as '2025-01-27.acacia',
    },
  );
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Hello Payments!';
  }

  async createCharge({ card, amount }: CreateChargeDto) {
    try {
      log('cardcard', card);
      log('amountamount', amount);
      // const paymentsMethod = await this.stripe.paymentMethods.create({
      //   type: 'card',
      //   card: {
      //     // ...card,
      //     // token: 'tok_visa',
      //     // token: 'tok_mastercard',
      //     // token: 'tok_visa_debit',
      //     // token: 'tok_mastercard_debit',
      //     // token: 'tok_visa_prepaid',
      //     // token: 'tok_mastercard_prepaid',
      //   },
      // });

      // log('paymentsMethod', paymentsMethod);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        confirm: true,
        payment_method: 'pm_card_visa',
        // payment_method: paymentsMethod.id,
        // payment_method_types: ['card'],
      });
      log('pass createCharge', paymentIntent);

      return paymentIntent;
    } catch (error) {
      log('errorerrorerrorerrorerrorerrorerrorerrorerrorerrorerror', error);
      throw error;
    }
  }
}
