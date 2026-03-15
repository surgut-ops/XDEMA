import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';

@Module({ providers: [], controllers: [CoursesController] })
export class CoursesModule {}
