import { HttpException, Injectable } from '@nestjs/common';
import { PostService } from '../post/post.service';

@Injectable()
export class TableService {
  constructor(private readonly postService: PostService) {}

  async getPostsForTable(userUuid: string, start: number) {
    try {
      return await this.postService.findPostsByUuid(userUuid, start);
    } catch (err) {
      const { message, status } = err;
      throw new HttpException(message, status);
    }
  }
}
