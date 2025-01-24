import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { log } from 'console';
import { UserDTO } from '../dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
    log('JwtAuthGuard.canActivate', jwt);
    if (!jwt) {
      return false;
    }
    log('passJwt');

    return this.authClient
      .send<UserDTO>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((response) => {
          // response คือจะได้จากการ return transport.send('authenticate', { Authentication: jwt }) แล้วมสร้าง key ชื่อว่า user ใน request ของ context ขึ้นมา (request.user เอาค่าที่ได้จาก TCP มาสร้าง key user ใน request)
          log('responseresponse', response);
          context.switchToHttp().getRequest().user = {
            ...response,
            pass: 'passsssssssssssss',
          };
        }),
        map(() => true),
      );
  }
}
