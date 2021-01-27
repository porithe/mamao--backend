import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowerService {
  constructor(private prisma: PrismaService) {}

  async follow(
    userUuid: string,
    toFollowUsername: string,
  ): Promise<{ success: boolean }> {
    try {
      const toFollowUser = await this.prisma.user.findUnique({
        where: { username: toFollowUsername },
      });
      if (!toFollowUser) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }
      const isUserAlreadyFollowed = await this.isUserAlreadyFollowed(
        userUuid,
        toFollowUser.uuid,
      );
      if (isUserAlreadyFollowed) {
        throw new HttpException(
          'User is already followed.',
          HttpStatus.CONFLICT,
        );
      }
      await this.prisma.user.update({
        where: {
          uuid: userUuid,
        },
        data: {
          following: {
            create: {
              followerUuid: toFollowUser.uuid,
            },
          },
        },
      });
      return { success: true };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async countFollowing(userUuid: string): Promise<number> {
    try {
      return await this.prisma.follows.count({
        where: {
          followingUuid: userUuid,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async countFollowers(userUuid: string): Promise<number> {
    try {
      return await this.prisma.follows.count({
        where: {
          followerUuid: userUuid,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async isUserAlreadyFollowed(
    followerUuid: string,
    followingUuid: string,
  ): Promise<boolean> {
    try {
      const follow = await this.prisma.follows.findUnique({
        where: {
          followerUuid_followingUuid: {
            followerUuid,
            followingUuid,
          },
        },
      });
      return !follow;
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
