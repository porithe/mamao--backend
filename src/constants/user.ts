import { IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
export interface ICreatedUser {
  uuid: string;
  username: string;
  email: string;
  createdAt: Date;
}

export class LoginUserDto {
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

export interface IUserLoggedIn {
  uuid: string;
  username: string;
  accessToken: string;
}
