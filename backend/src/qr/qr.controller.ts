import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@ApiTags('QR')
@Controller('qr')
export class QrController {
  constructor(
    private prisma: PrismaService,
    private notif: NotificationsService,
  ) {}

  @Post('order')
  async createOrder(
    @Body() body: { type: string; fromName: string; amount: number; details: string },
  ) {
    const order = await this.prisma.order.create({
      data: {
        type: body.type as never,
        status: 'PAID',
        clientName: body.fromName,
        clientEmail: 'qr@xdema.ru',
        amount: body.amount,
        details: body.details,
      },
    });
    await this.notif.sendTelegram(
      `📲 Live QR\nТип: ${body.type}\nОт: ${body.fromName}\nСумма: ${body.amount} ₽\n${body.details}`,
    );
    return order;
  }
}
