// gallery.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { AdminGuard } from '../auth/guards';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private gallery: GalleryService) {}

  @Get()
  getAll() { return this.gallery.getAll(); }

  @Post('upload')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File, @Body('label') label: string) {
    return this.gallery.upload(file, label || 'Photo');
  }

  @Post('url')
  @UseGuards(AdminGuard)
  addUrl(@Body() body: { label: string; imageUrl: string }) {
    return this.gallery.addByUrl(body.label, body.imageUrl);
  }

  @Patch('reorder')
  @UseGuards(AdminGuard)
  reorder(@Body() body: { ids: number[] }) { return this.gallery.reorder(body.ids); }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: any) { return this.gallery.update(+id, body); }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id') id: string) { return this.gallery.delete(+id); }
}
