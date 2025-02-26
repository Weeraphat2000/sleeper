import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { RoleDto } from './role.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
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
  @IsArray()
  @ValidateNested()
  @Type(() => RoleDto)
  roles?: RoleDto[];
}
