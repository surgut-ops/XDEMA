import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma.service';
import { AdminGuard } from '../auth/guards';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAll() {
    const rows = await this.prisma.siteSetting.findMany();
    const r: Record<string, unknown> = {};
    rows.forEach((s) => {
      try {
        r[s.key] = JSON.parse(s.value);
      } catch {
        r[s.key] = s.value;
      }
    });
    return r;
  }

  @Get(':key')
  async get(@Param('key') key: string) {
    const s = await this.prisma.siteSetting.findUnique({ where: { key } });
    if (!s) return null;
    try {
      return JSON.parse(s.value);
    } catch {
      return s.value;
    }
  }

  @Patch(':key')
  @UseGuards(AdminGuard)
  async set(@Param('key') key: string, @Body() body: { value: unknown }) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(body.value) },
      create: { key, value: JSON.stringify(body.value) },
    });
  }
}
