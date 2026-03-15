import { Controller, Get, Patch, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma.service';
import { AdminGuard } from '../auth/guards';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getAll() {
    return this.prisma.course.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } });
  }

  @Get(':slug')
  getOne(@Param('slug') slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
      include: { materials: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.prisma.course.update({ where: { id: +id }, data: body });
  }

  @Post(':id/materials')
  @UseGuards(AdminGuard)
  addMaterial(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.prisma.courseMaterial.create({ data: { ...body, courseId: +id } as never });
  }

  @Delete('materials/:id')
  @UseGuards(AdminGuard)
  deleteMaterial(@Param('id') id: string) {
    return this.prisma.courseMaterial.delete({ where: { id: +id } });
  }
}
