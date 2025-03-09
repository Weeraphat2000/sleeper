import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class CreateUserDTO {
  @ApiProperty({
    title: 'email',
    description: 'The email of the User',
    example: 'example@gmail.com',
    type: String,
  })
  @Field(() => String)
  @IsEmail()
  email: string;

  @ApiProperty({
    title: 'password',
    description: 'The password of the User',
    example: 'Password123*',
    type: String,
  })
  @IsStrongPassword()
  @Field(() => String)
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Field(() => [String], { nullable: true })
  roles?: string[];
}
