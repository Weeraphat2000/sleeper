import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { log } from 'console';
import { GetUserDTO } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async verifyUser(email: string, password: string) {
    log('UsersService.verifyUser', email, password);
    const user = await this.usersRepository.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async create(createUserDTO: CreateUserDTO) {
    await this.validateCreateUserDTO(createUserDTO);
    return this.usersRepository.create({
      ...createUserDTO,
      password: await bcrypt.hash(createUserDTO.password, 10),
    });
  }

  async getUser(getuserDTO: GetUserDTO) {
    return this.usersRepository.findOne(getuserDTO);
  }

  private async validateCreateUserDTO(createUserDTO: CreateUserDTO) {
    try {
      await this.usersRepository.findOne({
        email: createUserDTO.email,
      });
    } catch (e) {
      return null;
    }
    throw new UnprocessableEntityException('User already exists');
  }
}
