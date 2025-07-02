import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/RegisterDto';
import { comparePassword, hashPassword } from './../utils/passwordHelper';
import { LoginDto } from './dto/LoginDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    data: RegisterDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    const { username, password, role } = data;

    const existingUser = await this.userRepo.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = this.userRepo.create({
      username,
      password: hashedPassword,
      role,
    });

    const savedUser = await this.userRepo.save(user);

    const { password: _, ...dataWithoutPassword } = savedUser;

    return {
      message: 'User registered successfully',
      user: dataWithoutPassword,
    };
  }

  async login(
    data: LoginDto,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const { username, password } = data;

    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      throw new ConflictException('Invalid username or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    const { password: _, ...dataWithoutPassword } = user;

    return {
      accessToken: token,
      user: dataWithoutPassword,
    };
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new ConflictException('User not found');
    }

    return user;
  }
}
