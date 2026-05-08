// src/admin/admin.controller.ts
import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roules.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /admin/recruiters — Liste tous les recruteurs
  @Get('recruiters')
  getRecruiters() {
    return this.adminService.getRecruiters();
  }

  // DELETE /admin/recruiters/:id — Supprime un recruteur et ses offres
  @Delete('recruiters/:id')
  deleteRecruiter(@Param('id') id: string) {
    return this.adminService.deleteRecruiter(id);
  }
}
