import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { log } from 'console';
import { GetUserDto } from './dto/get-user.dto';
import { Role, User } from '@app/common';

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

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);

    const user = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      roles: createUserDto.roles?.map((role) => new Role(role)),
    });

    return this.usersRepository.create(user);

    // return this.usersRepository.create({
    //   id: 1,
    //   email: 'test@gmail.com',
    //   password: '123456',
    //   roles: [
    //     {
    //       name: 'admin',
    //       id: 1,
    //     },
    //   ],
    // });
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }

  private async validateCreateUser(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({
        email: createUserDto.email,
      });
    } catch (e) {
      return null;
    }
    throw new UnprocessableEntityException('User already exists');
  }
}
