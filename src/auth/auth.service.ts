import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserService } from '../user/user.service';
import {
  CreateUserDto,
  ICreatedUser,
  IUserLoggedIn,
  IValidatedUser,
  LoginUserDto,
} from '../constants/user';
import { User } from '@prisma/client';

enum ErrorMessages {
  USER_NOT_FOUND = 'User not found.',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(user: CreateUserDto): Promise<ICreatedUser> {
    try {
      const createdUser = await this.userService.createUser(user);
      return {
        uuid: createdUser.uuid,
        username: createdUser.username,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
      };
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<IValidatedUser | null> {
    try {
      const user = await this.userService.findOne(username);
      if (user && compareSync(password, user.password)) {
        const { password, ...result } = user;
        return result;
      }
      if (!user) {
        throw new HttpException(
          ErrorMessages.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return null;
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }

  async login(user: any): Promise<IUserLoggedIn> {
    const payload = {
      username: user.username,
      uuid: user.uuid,
      sub: user.uuid,
    };
    return {
      uuid: user.uuid,
      username: user.username,
      accessToken: this.jwtService.sign(payload),
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token);
  }
}
