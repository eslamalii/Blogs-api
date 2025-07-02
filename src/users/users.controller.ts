import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/constants/UserRole';

@Controller('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    const users = await this.usersService.findAll();

    return {
      message: 'Users retrieved successfully',
      data: users,
      count: users.length,
    };
  }
}
