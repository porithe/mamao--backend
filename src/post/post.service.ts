import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddPostDto,
  IAddedPost,
  IFoundPosts,
  IFoundPostWithAuthor,
} from '../constants/post';
import { LikeService } from '../like/like.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private readonly likeService: LikeService,
  ) {}

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

  private async addCommentCountToPosts(
    posts: IFoundPostWithAuthor[],
  ): Promise<IFoundPostWithAuthor[]> {
    try {
      for await (const post of posts) {
        post.commentCount = await this.prisma.comment.count({
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

  private async addLikeCountToPosts(
    posts: IFoundPostWithAuthor[],
    userUuid: string,
  ): Promise<IFoundPostWithAuthor[]> {
    try {
      for await (const post of posts) {
        const isLiked = await this.likeService.isPostAlreadyLiked(
          userUuid,
          post.uuid,
        );
        post.likeCount = await this.prisma.like.count({
          where: {
            postUuid: post.uuid,
          },
        });
        post.isLiked = isLiked;
      }
      return posts;
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async findPosts(
    username: string,
    userUuid: string,
    limit = 10,
    start = 0,
  ): Promise<IFoundPosts | []> {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          author: {
            username,
          },
        },
        select: {
          author: {
            select: {
              username: true,
            },
          },
          uuid: true,
          createdAt: true,
          text: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: start,
        take: limit,
      });
      if (posts.length > 0) {
        const postsWithCommentCount = await this.addCommentCountToPosts(posts);
        const postsWithLikeCount = await this.addLikeCountToPosts(
          postsWithCommentCount,
          userUuid,
        );
        return {
          data: postsWithLikeCount,
          paginationNumber:
            PostService.paginationCount(posts.length) === 10
              ? PostService.paginationCount(posts.length) + start
              : null,
        };
      }
      return [];
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async findPostsByUuid(uuid: string, start = 0): Promise<any> {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          author: {
            followers: {
              some: {
                followingUuid: uuid,
              },
            },
          },
        },
        select: {
          author: {
            select: {
              username: true,
            },
          },
          uuid: true,
          createdAt: true,
          text: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: start,
      });
      if (posts.length > 0) {
        const postsWithCommentCount = await this.addCommentCountToPosts(posts);
        const postsWithLikeCount = await this.addLikeCountToPosts(
          postsWithCommentCount,
          uuid,
        );
        return {
          data: postsWithLikeCount,
          paginationNumber:
            PostService.paginationCount(posts.length) === 10
              ? PostService.paginationCount(posts.length) + start
              : null,
        };
      }
      return [];
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  private static paginationCount(numOfPosts: number) {
    if (numOfPosts === 10) {
      return 10;
    } else {
      return numOfPosts;
    }
  }
}
