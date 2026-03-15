import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AdminGuard } from '../auth/guards';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Get()
  getAll(@Query('all') all?: string) {
    return all ? this.reviews.getAll() : this.reviews.getApproved();
  }

  @Post()
  create(@Body() body: { name: string; text: string; rating: number; event?: string }) {
    return this.reviews.create(body.name, body.text, body.rating, body.event);
  }

  @Patch(':id/approve')
  @UseGuards(AdminGuard)
  approve(@Param('id') id: string) { return this.reviews.approve(+id); }

  @Patch(':id/hide')
  @UseGuards(AdminGuard)
  hide(@Param('id') id: string) { return this.reviews.hide(+id); }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id') id: string) { return this.reviews.delete(+id); }
}
