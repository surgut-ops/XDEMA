import { Module } from '@nestjs/common';
import { AdminNotifController } from './admin.controller';

@Module({ providers: [], controllers: [AdminNotifController] })
export class AdminModule {}
