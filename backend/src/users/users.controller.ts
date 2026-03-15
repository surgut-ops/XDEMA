import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma.service';
import { AdminGuard, JwtAuthGuard } from '../auth/guards';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: { user: { id: number } }) {
    return this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        courses: { include: { course: { include: { materials: { orderBy: { sortOrder: 'asc' } } } } } },
        orders: { orderBy: { createdAt: 'desc' }, take: 20 },
        notifications: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: { user: { id: number } },
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const bcrypt = await import('bcrypt');
    const user = await this.prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return { error: 'User not found' };
    const valid = await bcrypt.compare(body.oldPassword, user.passwordHash);
    if (!valid) return { error: 'Incorrect current password' };
    const hash = await bcrypt.hash(body.newPassword, 12);
    await this.prisma.user.update({ where: { id: req.user.id }, data: { passwordHash: hash } });
    return { ok: true };
  }

  @Get()
  @UseGuards(AdminGuard)
  getAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id') id: string) {
    return this.prisma.user.delete({ where: { id: +id } });
  }
}
