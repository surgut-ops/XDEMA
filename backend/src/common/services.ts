// ═══════════════════════════════════════════════════════════
//  COURSES
// ═══════════════════════════════════════════════════════════
// src/courses/courses.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

export class CoursesService {
  constructor(protected prisma: PrismaService) {}

  getAll(activeOnly = true) {
    return this.prisma.course.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { sortOrder: 'asc' },
    });
  }

  getOne(slug: string) {
    return this.prisma.course.findUnique({ where: { slug }, include: { materials: { orderBy: { sortOrder: 'asc' } } } });
  }

  update(id: number, data: any) {
    return this.prisma.course.update({ where: { id }, data });
  }

  addMaterial(courseId: number, data: any) {
    return this.prisma.courseMaterial.create({ data: { ...data, courseId } });
  }

  deleteMaterial(id: number) {
    return this.prisma.courseMaterial.delete({ where: { id } });
  }
}

// ═══════════════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════════════
// src/orders/orders.service.ts
export class OrdersService {
  constructor(protected prisma: PrismaService) {}

  getAll(filter?: string) {
    return this.prisma.order.findMany({
      where: filter ? { type: filter as any } : {},
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  create(data: any) {
    return this.prisma.order.create({ data });
  }

  updateStatus(id: number, status: string) {
    return this.prisma.order.update({ where: { id }, data: { status: status as any } });
  }
}

// ═══════════════════════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════════════════════
// src/settings/settings.service.ts
export class SettingsService {
  constructor(protected prisma: PrismaService) {}

  async get(key: string) {
    const s = await this.prisma.siteSetting.findUnique({ where: { key } });
    return s ? JSON.parse(s.value) : null;
  }

  async getAll() {
    const settings = await this.prisma.siteSetting.findMany();
    const result: Record<string, any> = {};
    settings.forEach(s => { result[s.key] = JSON.parse(s.value); });
    return result;
  }

  async set(key: string, value: any) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }
}

// ═══════════════════════════════════════════════════════════
//  MESSAGES
// ═══════════════════════════════════════════════════════════
// src/messages/messages.service.ts
export class MessagesService {
  constructor(protected prisma: PrismaService) {}

  create(data: { fromName: string; contact: string; text?: string; type: string }) {
    return this.prisma.message.create({ data });
  }

  getAll() {
    return this.prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  }

  markRead(id: number) {
    return this.prisma.message.update({ where: { id }, data: { read: true } });
  }
}

// ═══════════════════════════════════════════════════════════
//  USERS
// ═══════════════════════════════════════════════════════════
// src/users/users.service.ts
import * as bcrypt from 'bcrypt';

export class UsersService {
  constructor(protected prisma: PrismaService) {}

  async getMe(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        courses: { include: { course: { include: { materials: { orderBy: { sortOrder: 'asc' } } } } } },
        orders: { orderBy: { createdAt: 'desc' }, take: 20 },
        notifications: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async changePassword(userId: number, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const valid = await bcrypt.compare(oldPass, user!.passwordHash);
    if (!valid) throw new Error('Incorrect current password');
    const hash = await bcrypt.hash(newPass, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
    return { ok: true };
  }

  getAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}

// ═══════════════════════════════════════════════════════════
//  QR
// ═══════════════════════════════════════════════════════════
// src/qr/qr.service.ts
export class QrService {
  constructor(protected prisma: PrismaService, protected notif: NotificationsService) {}

  async createQrOrder(type: string, fromName: string, amount: number, details: string) {
    const order = await this.prisma.order.create({
      data: {
        type: type as any,
        status: 'PAID',
        clientName: fromName,
        clientEmail: 'qr@xdema.ru',
        amount,
        details,
      },
    });
    await this.notif.sendTelegram(`📲 Live QR: ${type}\nОт: ${fromName}\nСумма: ${amount} ₽\n${details}`);
    return order;
  }
}

// placeholder imports needed for the above
import { NotificationsService } from '../notifications/notifications.service';
