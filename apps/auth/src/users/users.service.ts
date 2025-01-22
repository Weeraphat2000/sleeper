import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { log } from 'console';

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
    return this.usersRepository.create({
      ...createUserDTO,
      password: await bcrypt.hash(createUserDTO.password, 10),
    });
  }
}
