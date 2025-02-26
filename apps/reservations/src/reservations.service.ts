import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { log } from 'console';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, id: userId }: User,
  ) {
    try {
      const test = new Promise((resolve, reject) => {
        this.paymentsClient
          .send('create_charge', {
            ...createReservationDto.charge,
            email,
          })
          .subscribe({
            next: async (response) => {
              log('successsuccesssuccesssuccessna', response);
              const reservation = new Reservation({
                ...createReservationDto,
                timestamp: new Date(),
                invoiceId: response.id,
                userId,
              });
              const result =
                await this.reservationsRepository.create(reservation);

              resolve(result);
            },
            error: (error) => {
              log('errorna', error);
              reject(error);
            },
            complete: () => {
              log('completena');
            },
          });
      });
      log('testtesttest', await test);

      return test;
    } catch (error) {
      log('errorerrorerrorerror', error);
      if (error?.status == 'error') {
        throw new BadRequestException(error);
      }

      if (error?.code === 'ECONNREFUSED') {
        throw new BadRequestException('Payments service is not available');
      }
    }
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(id: number) {
    return this.reservationsRepository.find({ id });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  async remove(id: number) {
    return this.reservationsRepository.findOneAndDelete({ id });
  }

  async helloPayments() {
    return this.paymentsClient.send('getHello', {});
  }
}
