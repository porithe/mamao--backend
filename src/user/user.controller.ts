import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  EditUserDataDto,
  FindProfileDto,
  IUserDataUpdated,
  IUserProfile,
  IUserRequestJwt,
} from '../constants/user';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
  @Get(':username')
  async findProfile(
    @Param() params: FindProfileDto,
  ): Promise<IUserProfile | null> {
    return await this.userService.findProfile(params.username);
  }
}
