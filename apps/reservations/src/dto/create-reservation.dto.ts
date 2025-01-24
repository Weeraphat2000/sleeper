import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    title: 'startDate',
    description: 'The start date of the Reservation',
    example: '2021-10-01T00:00:00.000Z',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    title: 'endDate',
    description: 'The end date of the Reservation',
    example: '2021-10-01T00:00:00.000Z',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  // @ApiProperty({
  //   title: 'userId',
  //   description: 'The userId of the Reservation',
  //   example: '1',
  //   type: String,
  // })
  // @IsString()
  // @IsNotEmpty()
  // userId: string;

  @ApiProperty({
    title: 'placeId',
    description: 'The placeId of the Reservation',
    example: '1',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  placeId: string;

  @ApiProperty({
    title: 'inviteId',
    description: 'The inviteId of the Reservation',
    example: '1',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  inviteId: string;
}
