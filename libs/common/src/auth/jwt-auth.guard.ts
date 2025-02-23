import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { log } from 'console';
import { UserDTO } from '../dto';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;
    log('JwtAuthGuard.canActivate', jwt);
    if (!jwt) {
      return false;
    }
    log('passJwt');

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    log('rolesssss', roles); // จะถูกส่งเข้ามาจาก @Roles('admin')(decorator) ใน controller

    return this.authClient
      .send<UserDTO>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((response) => {
          log('responseeeee', response); // จะได้ response จากการ return transport.send('authenticate', { Authentication: jwt }) แล้วมสร้าง key ชื่อว่า user ใน request ของ context ขึ้นมา (request.user เอาค่าที่ได้จาก TCP มาสร้าง key user ใน request)

          if (roles) {
            for (const role of roles) {
              if (!response?.roles?.includes(role)) {
                this.logger.error('The user does not have valid roles');
                throw new UnauthorizedException('Unauthorized');
              }
            }
          }

          // response คือจะได้จากการ return transport.send('authenticate', { Authentication: jwt }) แล้วมสร้าง key ชื่อว่า user ใน request ของ context ขึ้นมา (request.user เอาค่าที่ได้จาก TCP มาสร้าง key user ใน request)
          log('responseresponse', response);
          context.switchToHttp().getRequest().user = {
            ...response,
            pass: 'passsssssssssssss',
          };
        }),

        map(() => true),

        catchError((error) => {
          this.logger.error('Error', error);
          return of(false); // คือ ถ้ามี error ให้ return false // authClient จะ return Observable กลับมา
        }),
      );
  }
}
