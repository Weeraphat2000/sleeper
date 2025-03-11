import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserDTO {
  @IsString()
  @IsNotEmpty()
  id: string;
}
