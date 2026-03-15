import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../common/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  // ── Create course checkout session ─────────────────────
  async createCourseSession(courseId: number, email: string, name: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new BadRequestException('Course not found');

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'rub',
          product_data: { name: `XDEMA — ${course.title} курс`, description: course.tagline || '' },
          unit_amount: course.price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.FRONTEND_URL}/account?success=1`,
      cancel_url: `${process.env.FRONTEND_URL}/courses?cancelled=1`,
      metadata: { type: 'COURSE', courseId: courseId.toString(), clientName: name, clientEmail: email },
    });

    return { url: session.url, sessionId: session.id };
  }

  // ── Create DJ booking payment ──────────────────────────
  async createServiceSession(amount: number, description: string, email: string, name: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'rub',
          product_data: { name: 'XDEMA DJ — Бронирование', description },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.FRONTEND_URL}/?booked=1`,
      cancel_url: `${process.env.FRONTEND_URL}/services`,
      metadata: { type: 'DJ_BOOKING', clientName: name, clientEmail: email, description },
    });
    return { url: session.url };
  }

  // ── Create Live QR session ──────────────────────────────
  async createQrSession(type: string, amount: number, fromName: string, details: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'rub',
          product_data: { name: `XDEMA Live QR — ${type}` },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/live?paid=1`,
      cancel_url: `${process.env.FRONTEND_URL}/live`,
      metadata: { type, fromName, details, amount: amount.toString() },
    });
    return { url: session.url };
  }

  // ── Handle Stripe webhook ──────────────────────────────
  async handleWebhook(payload: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload, signature, process.env.STRIPE_WEBHOOK_SECRET || '',
      );
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.processCompletedSession(session);
    }

    return { received: true };
  }

  private async processCompletedSession(session: Stripe.Checkout.Session) {
    const meta = session.metadata || {};
    const amount = Math.round((session.amount_total || 0) / 100);

    // Create order
    const order = await this.prisma.order.create({
      data: {
        type: meta.type as any || 'DJ_BOOKING',
        status: 'PAID',
        clientName: meta.clientName || 'Клиент',
        clientEmail: meta.clientEmail || session.customer_email || '',
        amount,
        stripeSession: session.id,
        courseId: meta.courseId ? parseInt(meta.courseId) : undefined,
        details: meta.details || meta.description,
      },
    });

    // If course — create user + userCourse
    if (meta.type === 'COURSE' && meta.courseId) {
      const courseId = parseInt(meta.courseId);
      let user = await this.prisma.user.findUnique({ where: { email: meta.clientEmail } });
      if (!user) {
        const tmpPass = Math.random().toString(36).slice(2, 10);
        const bcrypt = await import('bcrypt');
        const hash = await bcrypt.hash(tmpPass, 12);
        user = await this.prisma.user.create({
          data: { name: meta.clientName, email: meta.clientEmail, passwordHash: hash },
        });
        // Send welcome email with password
        await this.notifications.sendEmail(
          meta.clientEmail,
          'Добро пожаловать в XDEMA!',
          `Ваши данные для входа:\nEmail: ${meta.clientEmail}\nПароль: ${tmpPass}\n\nСайт: ${process.env.FRONTEND_URL}/account`
        );
      }
      await this.prisma.userCourse.upsert({
        where: { userId_courseId: { userId: user.id, courseId } },
        update: {},
        create: { userId: user.id, courseId },
      });
    }

    // Telegram notification
    const typeName = { COURSE: 'Курс', DJ_BOOKING: 'Бронирование DJ', QR_TRACK: 'QR Трек', QR_TIP: 'QR Чаевые' };
    await this.notifications.sendTelegram(
      `💰 Новый платёж\nТип: ${typeName[meta.type] || meta.type}\nКлиент: ${meta.clientName}\nSумма: ${amount.toLocaleString('ru')} ₽`
    );
  }
}
