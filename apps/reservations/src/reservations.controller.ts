import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, Roles, UserDTO } from '@app/common';
import { log } from 'console';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('helloPayments')
  async helloPayments() {
    log('ReservationsController.helloPayments');
    return this.reservationsService.helloPayments();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDTO, // get user from request.user
  ) {
    log('ReservationsController.create', createReservationDto, user);
    const _user = await this.reservationsService.create(
      createReservationDto,
      user,
    );
    log('ReservationsController.create', _user);
    return _user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  async remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
