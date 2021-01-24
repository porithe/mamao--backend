import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddPostDto, IAddedPost, IFoundPosts } from '../constants/post';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async addPost(userUuid: string, { text }: AddPostDto): Promise<IAddedPost> {
    try {
      const addedPost = await this.prisma.post.create({
        data: {
          text,
          author: {
            connect: { uuid: userUuid },
          },
        },
      });
      return {
        uuid: addedPost.uuid,
        createdAt: addedPost.createdAt,
      };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async addCommentsCount(postUuid: string): Promise<{ isSuccessful: boolean }> {
    const post = await this.prisma.post.findUnique({
      where: {
        uuid: postUuid,
      },
      select: {
        commentsCount: true,
      },
    });
    if (!post) throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);
    const updatedPost = await this.prisma.post.update({
      where: {
        uuid: postUuid,
      },
      data: {
        commentsCount: post.commentsCount + 1,
      },
    });
    if (!updatedPost) return { isSuccessful: false };
    return {
      isSuccessful: true,
    };
  }

  async findPosts(username: string): Promise<IFoundPosts[]> {
    try {
      return await this.prisma.post.findMany({
        where: {
          author: {
            username,
          },
        },
        select: {
          uuid: true,
          createdAt: true,
          text: true,
          commentsCount: true,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
