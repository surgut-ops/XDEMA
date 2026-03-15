import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';

@Module({ providers: [], controllers: [OrdersController] })
export class OrdersModule {}
