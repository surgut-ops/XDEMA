import { Module } from '@nestjs/common';
import { AdminNotifController } from './admin.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({ imports: [NotificationsModule], providers: [], controllers: [AdminNotifController] })
export class AdminModule {}
