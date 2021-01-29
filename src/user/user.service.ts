import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import {
  CreateUserDto,
  EditUserDataDto,
  ICreatedUser, IFoundUser,
  IUserDataUpdated,
  IUserProfile,
  UserErrorMessages,
} from '../constants/user';
import { hash } from 'bcrypt';
import { FollowerService } from '../follower/follower.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly followerService: FollowerService,
  ) {}

  async createUser(userData: CreateUserDto): Promise<ICreatedUser> {
    try {
      userData.password = await hash(
        userData.password,
        Number(process.env.SALT),
      );
      return await this.prisma.user.create({
        data: {
          ...userData,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async findOne(username: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          username,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async isUsernameInUse(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    return !!user;
  }

  async isEmailInUse(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return !!user;
  }

  async editUserData(
    uuid: string,
    userData: EditUserDataDto,
  ): Promise<IUserDataUpdated> {
    try {
      await this.prisma.user.update({
        where: {
          uuid,
        },
        data: userData,
      });
      return {
        ...userData,
      };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async findProfile(username: string): Promise<IUserProfile | null> {
    try {
      const profile = await this.prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          uuid: true,
          username: true,
          description: true,
          avatar: true,
        },
      });
      if (profile) {
        const following = await this.followerService.countFollowing(
          profile.uuid,
        );
        const followers = await this.followerService.countFollowers(
          profile.uuid,
        );
        return {
          username: profile.username,
          description: profile.description || '',
          avatar: profile.avatar || '',
          following: following,
          followers: followers,
        };
      }
      throw new HttpException(
        UserErrorMessages.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async followUser(
    userUuid: string,
    toFollowUsername: string,
  ): Promise<{ success: boolean }> {
    try {
      const user = await this.findOne(toFollowUsername);
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }
      return await this.followerService.follow(userUuid, user.uuid);
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async unFollowUser(
    userUuid: string,
    toUnfollowUsername: string,
  ): Promise<{ success: boolean }> {
    try {
      const user = await this.findOne(toUnfollowUsername);
      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }
      return await this.followerService.unFollow(userUuid, user.uuid);
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async searchUsers(username: string): Promise<IFoundUser[] | []> {
    try {
      return await this.prisma.user.findMany({
        where: {
          username: {
            contains: username,
          },
        },
        select: {
          username: true,
          avatar: true,
        },
      });
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
