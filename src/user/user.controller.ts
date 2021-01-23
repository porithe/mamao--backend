import { Body, Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  EditUserDataDto,
  IUserDataUpdated,
  IUserRequestJwt,
} from '../constants/user';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user')
@ApiBearerAuth()
@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
