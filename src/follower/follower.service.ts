import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IFollowingUuidList } from '../constants/follower';

@Injectable()
export class FollowerService {
  constructor(private prisma: PrismaService) {}

  async follow(
    userUuid: string,
    toFollowUuid: string,
  ): Promise<{ success: boolean }> {
    try {
      const isUserAlreadyFollowed = await this.isUserAlreadyFollowed(
        userUuid,
        toFollowUuid,
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
          followers: {
            create: {
              followingUuid: toFollowUuid,
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
      console.log(await this.getFollowingUuidList(userUuid));
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

  async countFollowers(userUuid: string): Promise<number> {
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

  private async isUserAlreadyFollowed(
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
      return !!follow;
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async unFollow(
    userUuid: string,
    toUnfollowUuid: string,
  ): Promise<{ success: boolean }> {
    try {
      const isUserAlreadyFollowed = await this.isUserAlreadyFollowed(
        userUuid,
        toUnfollowUuid,
      );
      if (!isUserAlreadyFollowed) {
        throw new HttpException('User is not followed.', HttpStatus.CONFLICT);
      }
      await this.prisma.user.update({
        where: {
          uuid: userUuid,
        },
        data: {
          following: {
            delete: {
              followerUuid_followingUuid: {
                followerUuid: userUuid,
                followingUuid: toUnfollowUuid,
              },
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

  async getFollowingUuidList(userUuid: string): Promise<IFollowingUuidList[]> {
    try {
      return await this.prisma.follows.findMany({
        where: {
          followerUuid: userUuid,
        },
        select: {
          followingUuid: true,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
