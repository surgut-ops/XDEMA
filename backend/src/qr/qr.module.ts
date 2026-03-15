import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({ imports: [NotificationsModule], providers: [], controllers: [QrController] })
export class QrModule {}
