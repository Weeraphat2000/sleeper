import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  placeId?: string;
  inviteId?: string;
}
