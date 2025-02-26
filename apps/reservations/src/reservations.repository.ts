import { Injectable, Logger } from '@nestjs/common';
import { Reservation } from './models/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '@app/common/database/abstractTypeorm.repository';

@Injectable()
export class ReservationsRepository extends AbstractRepository<Reservation> {
  protected readonly logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectRepository(Reservation)
    reservationModul: Repository<Reservation>,
    entityManager: EntityManager,
  ) {
    super(reservationModul, entityManager);
  }
}
