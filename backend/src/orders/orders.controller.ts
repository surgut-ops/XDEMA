import { Controller, Get, Patch, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma.service';
import { AdminGuard } from '../auth/guards';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(AdminGuard)
  getAll(@Req() req: { query?: { type?: string } }) {
    const type = req.query?.type;
    return this.prisma.order.findMany({
      where: type ? { type: type as never } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.prisma.order.update({ where: { id: +id }, data: { status: body.status as never } });
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.prisma.order.create({ data: body as never });
  }
}
