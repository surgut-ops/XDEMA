// src/reviews/reviews.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService, private notif: NotificationsService) {}

  getApproved() {
    return this.prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  getAll() {
    return this.prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(name: string, text: string, rating: number, event?: string) {
    const review = await this.prisma.review.create({
      data: { name, text, rating, event },
    });
    await this.notif.sendTelegram(`⭐ Новый отзыв\nОт: ${name}\nОценка: ${rating}/5\n${text.slice(0, 100)}`);
    return review;
  }

  approve(id: number) {
    return this.prisma.review.update({ where: { id }, data: { approved: true } });
  }

  hide(id: number) {
    return this.prisma.review.update({ where: { id }, data: { approved: false } });
  }

  delete(id: number) {
    return this.prisma.review.delete({ where: { id } });
  }
}
