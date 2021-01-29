import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PostService } from '../post/post.service';

@Module({
  providers: [TableService, PrismaService, PostService],
  controllers: [TableController],
})
export class TableModule {}
