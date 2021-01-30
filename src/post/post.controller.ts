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
  ApiBearerAuth, ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiNotFoundResponse,
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
import { LikeService } from '../like/like.service';
import { LikePostDto } from '../constants/like';

@ApiTags('post')
@Controller('v1/post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly likeService: LikeService,
  ) {}

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

  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @Get('findAll/:username')
  async findPosts(
    @Request() req: { user: IUserRequestJwt },
    @Param() params: FindPostsDto,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('start', ParseIntPipe) start: number,
  ): Promise<IFoundPosts | []> {
    return await this.postService.findPosts(params.username, req.user.uuid, limit, start);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully liked post.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiNotFoundResponse({
    description: 'Post not found.',
  })
  @ApiConflictResponse({
    description: 'Post is already liked.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('like/:postUuid')
  async likePost(
    @Request() req: { user: IUserRequestJwt },
    @Param() params: LikePostDto,
  ): Promise<{ success: boolean }> {
    return await this.likeService.likePost(req.user.uuid, params.postUuid);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successfully unliked post.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiNotFoundResponse({
    description: 'Post not found.',
  })
  @ApiConflictResponse({
    description: 'Post is not liked.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Get('unlike/:postUuid')
  async unLikePost(
    @Request() req: { user: IUserRequestJwt },
    @Param() params: LikePostDto,
  ): Promise<{ success: boolean }> {
    return await this.likeService.unLikePost(req.user.uuid, params.postUuid);
  }
}
