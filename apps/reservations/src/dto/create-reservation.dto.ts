import { CreateChargeDto } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';

@InputType()
export class CreateReservationDto {
  @ApiProperty({
    title: 'startDate',
    description: 'The start date of the Reservation',
    example: '2021-10-01T00:00:00.000Z',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  @Field()
  startDate: Date;

  @ApiProperty({
    title: 'endDate',
    description: 'The end date of the Reservation',
    example: '2021-10-01T00:00:00.000Z',
    type: Date,
  })
  @IsDate()
  @Type(() => Date)
  @Field()
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

  // @ApiProperty({
  //   title: 'placeId',
  //   description: 'The placeId of the Reservation',
  //   example: '1',
  //   type: String,
  // })
  // @IsString()
  // @IsNotEmpty()
  // placeId: string;

  // @ApiProperty({
  //   title: 'inviteId',
  //   description: 'The inviteId of the Reservation',
  //   example: '1',
  //   type: String,
  // })
  // @IsString()
  // @IsNotEmpty()
  // inviteId: string;

  @ApiProperty({
    title: 'charge',
    description: 'The charge of the Reservation',
    type: CreateChargeDto,
    example: {
      card: {
        number: '4242424242424242',
        expMonth: 12,
        expYear: 2023,
        cvc: '123',
      },
      amount: 100,
    },
  })
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  @Field(() => CreateChargeDto)
  charge: CreateChargeDto;
}
