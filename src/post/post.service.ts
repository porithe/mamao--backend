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

  async addCommentsCountToPosts(posts: any): Promise<any> {
    try {
      for await (const post of posts) {
        post.commentCountXD = await this.prisma.comment.count({
          where: {
            postUuid: post.uuid,
          },
        });
      }
      return posts;
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async findPosts(
    username: string,
    limit: number,
    start: number,
  ): Promise<IFoundPosts | []> {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          author: {
            username,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: start,
        take: limit,
      });
      if (posts.length > 0) {
        return {
          data: await this.addCommentsCountToPosts(posts),
          pagination: {
            next: `${
              process.env.URL_API
            }post/findAll/${username}/?limit=${limit}&start=${start + 10}`,
          },
        };
      }
      return [];
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
