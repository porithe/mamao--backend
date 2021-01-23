import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddPostDto, IAddedPost } from '../constants/post';
import { IUserRequestJwt } from '../constants/user';

@ApiTags('post')
@ApiBearerAuth()
@Controller('v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiCreatedResponse({
    description: 'Post successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(
    @Body() postData: AddPostDto,
    @Request() req: { user: IUserRequestJwt },
  ): Promise<IAddedPost> {
    return await this.postService.addPost(req.user.uuid, postData);
  }
}
