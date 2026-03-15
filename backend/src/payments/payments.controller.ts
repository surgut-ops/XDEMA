import { Controller, Post, Body, Headers, Req, RawBodyRequest, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('checkout')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('course')
  createCourse(@Body() body: { courseId: number; email: string; name: string }) {
    return this.payments.createCourseSession(body.courseId, body.email, body.name);
  }

  @Post('service')
  createService(@Body() body: { amount: number; description: string; email: string; name: string }) {
    return this.payments.createServiceSession(body.amount, body.description, body.email, body.name);
  }

  @Post('qr')
  createQr(@Body() body: { type: string; amount: number; fromName: string; details: string }) {
    return this.payments.createQrSession(body.type, body.amount, body.fromName, body.details);
  }
}

@Controller('payments')
export class WebhookController {
  constructor(private payments: PaymentsService) {}

  @Post('webhook')
  webhook(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.payments.handleWebhook(req.rawBody, sig);
  }
}
