import { UnauthorizedException } from '@nestjs/common';

import { app } from './app';

import { AUTH_SERVICE } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { log } from 'console';

export const authContext = async ({ req }: { req: Request }) => {
  try {
    const authClient = app.get<ClientProxy>(AUTH_SERVICE);
    const user = await lastValueFrom(
      authClient.send('authenticate', {
        Authentication: req.headers?.authentication,
      }),
    );
    log('useruseruseruseruseruser', user);
    return {
      user: {
        _id: user._id,
        email: user.email,
      },
    };
  } catch (e) {
    throw new UnauthorizedException(e);
  }
};
