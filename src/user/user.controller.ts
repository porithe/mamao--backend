import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  EditUserDataDto,
  FindProfileDto,
  FollowUserDto, IFoundUser,
  IUserDataUpdated,
  IUserProfile,
  IUserRequestJwt, SearchUserDto,
} from '../constants/user';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user')
@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully edited user data.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateData(
    @Body() userData: EditUserDataDto,
    @Request() req: { user: IUserRequestJwt },
  ): Promise<IUserDataUpdated> {
    return this.userService.editUserData(req.user.uuid, userData);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully returned user profile.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async findProfile(
    @Request() req: { user: IUserRequestJwt },
    @Param() params: FindProfileDto,
  ): Promise<IUserProfile | null> {
    return await this.userService.findProfile(req.user.uuid, params.username);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully followed.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiConflictResponse({
    description: 'User is already followed.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Put('follow/:username')
  async followProfile(
    @Request() req: { user: IUserRequestJwt },
    @Param() params: FollowUserDto,
  ): Promise<{ success: boolean }> {
    return await this.userService.followUser(req.user.uuid, params.username);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully unfollowed.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiConflictResponse({
    description: 'User is not followed.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Put('unfollow/:username')
  async unFollowProfile(
    @Request() req: { user: IUserRequestJwt },
    @Param() params: FollowUserDto,
  ): Promise<{ success: boolean }> {
    return await this.userService.unFollowUser(req.user.uuid, params.username);
  }

  @ApiOkResponse({
    description: 'Successfully returned users.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get('search/:username')
  async search(@Param() params: SearchUserDto): Promise<IFoundUser[] | []> {
    return await this.userService.searchUsers(params.username);
  }
}
