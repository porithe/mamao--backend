import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCommentDto, IAddedComment } from '../constants/comment';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async create(
    userUuid: string,
    { text, postUuid }: AddCommentDto,
  ): Promise<IAddedComment> {
    try {
      const createdComment = await this.prisma.comment.create({
        data: {
          text,
          post: {
            connect: {
              uuid: postUuid,
            },
          },
          user: {
            connect: {
              uuid: userUuid,
            },
          },
        },
      });
      if (createdComment) return createdComment;
      throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async findComments(postUuid: string): Promise<any> {
    try {
      return await this.prisma.comment.findMany({
        where: {
          postUuid,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
