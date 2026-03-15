import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GalleryService {
  private s3: S3Client;

  constructor(private prisma: PrismaService) {
    this.s3 = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || 'ru-central1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
      },
    });
  }

  getAll() {
    return this.prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async upload(file: Express.Multer.File, label: string) {
    const key = `gallery/${uuid()}-${file.originalname}`;
    await this.s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    }));
    const imageUrl = `${process.env.S3_PUBLIC_URL}/${key}`;
    return this.prisma.galleryItem.create({ data: { label, imageUrl } });
  }

  addByUrl(label: string, imageUrl: string) {
    return this.prisma.galleryItem.create({ data: { label, imageUrl } });
  }

  update(id: number, data: { label?: string; colSpan?: number; height?: number; sortOrder?: number }) {
    return this.prisma.galleryItem.update({ where: { id }, data });
  }

  async reorder(ids: number[]) {
    await Promise.all(ids.map((id, i) =>
      this.prisma.galleryItem.update({ where: { id }, data: { sortOrder: i } })
    ));
    return { ok: true };
  }

  async delete(id: number) {
    const item = await this.prisma.galleryItem.findUnique({ where: { id } });
    if (item?.imageUrl?.includes(process.env.S3_BUCKET || '')) {
      const key = item.imageUrl.split('.net/')[1];
      try {
        await this.s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
      } catch (e) { /* ignore */ }
    }
    return this.prisma.galleryItem.delete({ where: { id } });
  }
}
