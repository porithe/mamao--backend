import { IsEmail, Length, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IProfilePost } from './post';

export enum UserErrorMessages {
  NOT_FOUND = 'User not found.',
}

export class CreateUserDto {
  @ApiProperty({
    default: 'johndoe',
  })
  @Length(4, 24)
  username: string;

  @ApiProperty({
    default: 'pa$Sw0rd',
  })
  @Length(8, 32)
  password: string;

  @ApiProperty({
    default: 'example@email.com',
  })
  @IsEmail()
  email: string;
}

export class LoginUserDto {
  @ValidateNested({ each: true })
  @ApiProperty({
    default: 'johndoe',
  })
  @Length(4, 24)
  username: string;

  @ApiProperty({
    default: 'pa$Sw0rd',
  })
  @Length(8, 32)
  password: string;
}

export class EditUserDataDto {
  @ApiProperty({
    default: 'My description',
  })
  @Length(0, 120)
  description: string;

  @ApiProperty({
    default: 'myimg.com/img.jpg',
  })
  @Length(0, 120)
  avatar: string;
}

export class FindProfileDto {
  @ApiProperty({
    default: 'johndoe',
  })
  @Length(4, 24)
  username: string;
}

export interface ICreatedUser {
  uuid: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface IUserLoggedIn {
  uuid: string;
  username: string;
  accessToken: string;
}

export interface IValidatedUser {
  uuid: string;
  username: string;
  email: string;
  description: string | null;
  avatar: string | null;
  following: number | null;
  followers: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRequestJwt {
  uuid: string;
  username: string;
}

export interface IUserDataUpdated {
  description?: string;
  avatar?: string;
}

export interface IUserProfile {
  username: string;
  description: string;
  avatar: string | null;
  followers: number | null;
  following: number | null;
  posts: IProfilePost[];
}
