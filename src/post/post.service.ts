import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddPostDto, IAddedPost } from '../constants/post';

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
}
