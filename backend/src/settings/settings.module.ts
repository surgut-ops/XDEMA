import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';

@Module({ providers: [], controllers: [SettingsController] })
export class SettingsModule {}
