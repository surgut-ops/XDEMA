import { Controller, Get, Patch, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma.service';
import { AdminGuard } from '../auth/guards';
import { NotificationsService } from '../notifications/notifications.service';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(
    private prisma: PrismaService,
    private notif: NotificationsService,
  ) {}

  @Post()
  async create(
    @Body()
    body: { fromName: string; contact: string; text?: string; type: string },
  ) {
    const msg = await this.prisma.message.create({ data: body });
    await this.notif.sendTelegram(
      `✉️ Новое сообщение\nОт: ${body.fromName}\nКонтакт: ${body.contact}\nТип: ${body.type}\n${body.text?.slice(0, 100) || ''}`,
    );
    return msg;
  }

  @Get()
  @UseGuards(AdminGuard)
  getAll() {
    return this.prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Patch(':id/read')
  @UseGuards(AdminGuard)
  read(@Param('id') id: string) {
    return this.prisma.message.update({ where: { id: +id }, data: { read: true } });
  }
}
