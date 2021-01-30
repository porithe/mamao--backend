import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async likePost(
    userUuid: string,
    postUuid: string,
  ): Promise<{ success: boolean }> {
    try {
      const isPostLiked = await this.isPostIsAlreadyLiked(userUuid, postUuid);
      if (isPostLiked) {
        throw new HttpException('Post is already liked', HttpStatus.CONFLICT);
      }
      await this.prisma.post.update({
        where: {
          uuid: postUuid,
        },
        data: {
          likes: {
            create: {
              userUuid,
            },
          },
        },
      });
      return {
        success: true,
      };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  private async isPostIsAlreadyLiked(
    userUuid: string,
    postUuid: string,
  ): Promise<boolean> {
    try {
      const post = await this.prisma.post.findUnique({
        where: {
          uuid: postUuid,
        },
        select: {
          likes: {
            where: {
              userUuid,
            },
          },
        },
      });
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return post.likes.length > 0;
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async unLikePost(
    userUuid: string,
    postUuid: string,
  ): Promise<{ success: boolean }> {
    try {
      const isPostLiked = await this.isPostIsAlreadyLiked(userUuid, postUuid);
      if (!isPostLiked) {
        throw new HttpException('Post is not liked', HttpStatus.CONFLICT);
      }
      const post = await this.prisma.post.findUnique({
        where: {
          uuid: postUuid,
        },
        select: {
          likes: {
            where: {
              userUuid,
            },
          },
        },
      });
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      const likeUuid = post.likes[0].uuid;
      await this.prisma.like.delete({
        where: {
          uuid: likeUuid,
        },
      });
      return {
        success: true,
      };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
