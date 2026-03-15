import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma.service';
import { AdminGuard } from '../auth/guards';

@ApiTags('Admin/Notifications')
@Controller('admin/notifications')
export class AdminNotifController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(AdminGuard)
  async send(
    @Body()
    body: {
      title: string;
      text: string;
      imageUrl?: string;
      imageHeight?: number;
      targetAll?: boolean;
      targetCourse?: string;
      userId?: number;
    },
  ) {
    return this.prisma.userNotification.create({ data: body as never });
  }

  @Get()
  @UseGuards(AdminGuard)
  getAll() {
    return this.prisma.userNotification.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id') id: string) {
    return this.prisma.userNotification.delete({ where: { id: +id } });
  }
}
