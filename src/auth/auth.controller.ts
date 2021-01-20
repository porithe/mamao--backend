import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto, ICreatedUser, LoginUserDto } from '../constants/user';
import { DoesUserExistGuard } from './doesUserExist.guard';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiConflictResponse({
    description: 'Username or email already in use.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
  })
  @UseGuards(DoesUserExistGuard)
  @Post('register')
  async register(@Body() userData: CreateUserDto): Promise<ICreatedUser> {
    return this.authService.register(userData);
  }

  @ApiCreatedResponse({
    description: 'Successfully logged in.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiUnauthorizedResponse({
    description: 'Wrong password.',
  })
  @ApiNotFoundResponse({
    description: 'Username not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginData: LoginUserDto) {
    return this.authService.login(loginData);
  }
}
