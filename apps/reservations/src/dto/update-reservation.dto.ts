import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiProperty({
    title: 'startDate',
    description: 'The start date of the Reservation',
    example: '2021-10-01T00:00:00.000Z',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    title: 'endDate',
    description: 'The end date of the Reservation',
    example: '2021-10-01T00:00:00.000Z',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    title: 'userId',
    description: 'The userId of the Reservation',
    example: '1',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    title: 'placeId',
    description: 'The placeId of the Reservation',
    example: '1',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  placeId?: string;

  @ApiProperty({
    title: 'inviteId',
    description: 'The inviteId of the Reservation',
    example: '1',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  inviteId?: string;
}
