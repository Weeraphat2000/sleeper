import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { log } from 'console';
import { GetUserDTO } from './dto/get-user.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async verifyUser(email: string, password: string) {
    log('UsersService.verifyUser', email, password);
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async create(createUserDTO: CreateUserDTO) {
    await this.validateCreateUserDTO(createUserDTO);
    return this.prismaService.user.create({
      data: {
        ...createUserDTO,
        password: await bcrypt.hash(createUserDTO.password, 10),
      },
    });
  }

  async getUser(getuserDTO: GetUserDTO) {
    return this.prismaService.user.findFirst({
      where: {
        id: +getuserDTO.id,
      },
    });
  }

  private async validateCreateUserDTO(createUserDTO: CreateUserDTO) {
    try {
      await this.prismaService.user.findFirstOrThrow({
        where: {
          email: createUserDTO.email,
        },
      });
    } catch (e) {
      return null;
    }
    throw new UnprocessableEntityException('User already exists');
  }
}
