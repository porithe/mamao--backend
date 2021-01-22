import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import {
  CreateUserDto,
  EditUserDataDto,
  ICreatedUser, IUserDataUpdated,
} from '../constants/user';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
}
