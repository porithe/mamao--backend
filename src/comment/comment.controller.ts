import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  AddCommentDto,
  FindCommentsDto,
  IAddedComment,
} from '../constants/comment';
import { IUserRequestJwt } from '../constants/user';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('comment')
@Controller('v1/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Successfully created comment.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiNotFoundResponse({
    description: 'Post not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async add(
    @Body() addCommentData: AddCommentDto,
    @Request() req: { user: IUserRequestJwt },
  ): Promise<IAddedComment> {
    return await this.commentService.create(req.user.uuid, addCommentData);
  }

  @ApiOkResponse({
    description: 'Successfully returned comments.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request (validation error?).',
  })
  @ApiNotFoundResponse({
    description: 'Post not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get('findAll/:postUuid')
  async findProfile(@Param() params: FindCommentsDto) {
    return await this.commentService.findComments(params.postUuid);
  }
}
