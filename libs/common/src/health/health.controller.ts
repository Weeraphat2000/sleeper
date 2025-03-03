import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

@Controller('/')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHealth() {
    log('Health check');
    log(this.configService.get('LOCAL'), 'llllllll');
    log(this.configService.get('DEVELOPMENT'), 'dddddddd');

    log(this.configService.get('database.port'), 'database.port');
    return true;
  }
}
