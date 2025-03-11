import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerModule } from '@app/common/logger/logger.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [LoggerModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  // export ให้ UsersService และ UsersRepository ใช้งานได้จากภายนอก
  exports: [UsersService],
})
export class UsersModule {}
