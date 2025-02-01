import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { log } from 'console';
// import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    try {
      // return this.paymentsClient
      //   .send('create_charge', createReservationDto.charge)
      //   .pipe(
      //     map(() => {
      //       const reservation = this.reservationsRepository.create({
      //         ...createReservationDto,
      //         timestamp: new Date(),
      //         userId,
      //       });
      //       return reservation;
      //     }),
      //   );

      const test = new Promise((resolve, reject) => {
        this.paymentsClient
          .send('create_charge', createReservationDto.charge)
          .subscribe({
            next: async (response) => {
              log('successsuccesssuccesssuccessna', response);
              const reservation = await this.reservationsRepository.create({
                ...createReservationDto,
                invoiceId: response.id,
                timestamp: new Date(),
                userId,
              });
              resolve(reservation);
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

  async findOne(_id: string) {
    return this.reservationsRepository.find({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }

  async helloPayments() {
    return this.paymentsClient.send('getHello', {});
  }
}
