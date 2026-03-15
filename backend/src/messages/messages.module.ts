import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({ imports: [NotificationsModule], providers: [], controllers: [MessagesController] })
export class MessagesModule {}
