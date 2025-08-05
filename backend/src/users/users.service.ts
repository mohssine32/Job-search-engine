
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, role } = createUserDto;

    // 1. Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // 2. Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10); // 10 est le "coût" du hachage

    // 3. Créer l'utilisateur dans la base de données
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword, // On sauvegarde le mot de passe haché
        role,
      },
    });

    // 4. Retirer le mot de passe de l'objet retourné
    const { password: _, ...result } = user;
    return result;
  }

  // On ajoute aussi une fonction pour trouver un utilisateur par email,
  // l'AuthService en aura besoin.
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  // 👇👇 AJOUTEZ CETTE MÉTHODE À VOTRE FICHIER USERS.SERVICE.TS 👇👇

  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }
}