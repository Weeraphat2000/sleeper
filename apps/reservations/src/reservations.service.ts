import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PAYMENTS_SERVICE, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { log } from 'console';
import { PrismaService } from './prisma.service';
// import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, id: userId }: User,
  ) {
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
          .send('create_charge', {
            ...createReservationDto.charge,
            email,
          })
          .subscribe({
            next: async (response) => {
              log('successsuccesssuccesssuccessna', response);
              log('invoiceId', response.invoiceId);
              const reservation = await this.prismaService.reservation.create({
                data: {
                  endDate: createReservationDto.endDate,
                  invoiceId: response.id,
                  startDate: createReservationDto.startDate,
                  userId,
                  timestamp: new Date(),
                },
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
    return this.prismaService.reservation.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.reservation.findUnique({ where: { id } });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.prismaService.reservation.update({
      where: { id },
      data: updateReservationDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.reservation.delete({ where: { id } });
  }

  async helloPayments() {
    return this.paymentsClient.send('getHello', {});
  }
}
