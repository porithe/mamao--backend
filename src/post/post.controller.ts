import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  AddPostDto,
  FindPostsDto,
  IAddedPost,
  IFoundPosts,
} from '../constants/post';
import { IUserRequestJwt } from '../constants/user';

@ApiTags('post')
@Controller('v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
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

  @ApiQuery({
    name: 'limit',
    example: 10,
  })
  @ApiQuery({
    name: 'start',
    example: 0,
  })
  @ApiOkResponse({
    description: 'Successfully returned posts.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get('findAll/:username')
  async findPosts(
    @Param() params: FindPostsDto,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('start', ParseIntPipe) start: number,
  ): Promise<IFoundPosts | []> {
    return await this.postService.findPosts(params.username, limit, start);
  }
}
