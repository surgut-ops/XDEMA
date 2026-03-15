import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'XDEMA <noreply@xdema.ru>',
        to, subject, text, html,
      });
    } catch (e) {
      console.error('Email send error:', e.message);
    }
  }

  async sendTelegram(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    } catch (e) {
      console.error('Telegram send error:', e.message);
    }
  }

  async sendUserNotification(userId: number, title: string, text: string, imageUrl?: string) {
    // Saved to DB by NotificationsController
    await this.sendTelegram(`📬 Уведомление отправлено\nПользователь #${userId}: ${title}`);
  }
}
