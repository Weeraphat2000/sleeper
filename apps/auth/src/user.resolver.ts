import { UserDocument } from '@app/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users/users.service';
import { CreateUserDTO } from './users/dto/create-user.dto';

@Resolver(() => UserDocument)
export class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => UserDocument)
  async createUser(@Args('createUserInput') createUserInput: CreateUserDTO) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [UserDocument], { name: 'users' })
  async findAll() {
    return this.userService.findAll();
  }
}
