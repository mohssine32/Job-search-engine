// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) { 
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      // Maintenant, TypeScript sait ce qu'est UnauthorizedException
      throw new UnauthorizedException("Identifiants incorrects");
    }
    return this.authService.login(user);
  }
}