// src/users/users.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // Les routes commenceront par /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Route pour l'inscription
  // POST /users/register
  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Renvoie un statut 201 en cas de succès
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}