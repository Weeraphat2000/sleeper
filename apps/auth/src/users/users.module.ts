import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common/database';
import { LoggerModule } from '@app/common/logger/logger.module';
import { UsersRepository } from './users.repository';
import { UserDocument, UserSchema } from '@app/common';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  // export ให้ UsersService และ UsersRepository ใช้งานได้จากภายนอก
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
