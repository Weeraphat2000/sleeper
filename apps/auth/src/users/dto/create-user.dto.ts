import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    title: 'email',
    description: 'The email of the User',
    example: 'example@gmail.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    title: 'password',
    description: 'The password of the User',
    example: 'Password123*',
    type: String,
  })
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  roles: string;
}
