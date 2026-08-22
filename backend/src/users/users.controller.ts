import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { SearchUserDto } from './dto/search-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get('search')
  search(@Query() dto: SearchUserDto) {
    return this.usersService.findByEmail(dto.email);
  }
}