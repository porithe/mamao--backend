import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma/prisma.service';
import { CommentController } from './comment.controller';
import { PostService } from '../post/post.service';

@Module({
  providers: [CommentService, PrismaService, PostService],
  controllers: [CommentController],
})
export class CommentModule {}
