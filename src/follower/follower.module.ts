import { Module } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [FollowerService, PrismaService],
})
export class FollowerModule {}
