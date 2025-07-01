import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import { RegisterDto } from './dto/RegisterDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body(ValidationPipe) data: LoginDto) {
    return this.authService.login(data);
  }
}
