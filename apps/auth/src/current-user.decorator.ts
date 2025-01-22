import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { log } from 'console';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  log('getCurrentUserByContext', context.switchToHttp().getRequest().user);
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
