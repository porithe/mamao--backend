import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [LikeService, PrismaService],
})
export class LikeModule {}
