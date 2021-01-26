import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddPostDto {
  @ApiProperty({
    default: 'My example post',
  })
  @Length(1, 140)
  text: string;
}

export class FindPostsDto {
  @ApiProperty({
    default: 'johndoe',
  })
  @Length(4, 24)
  username: string;
}

export interface IAddedPost {
  uuid: string;
  createdAt: Date;
}

interface FoundPost {
  uuid: string;
  createdAt: Date;
  text: string;
  commentsCount: number;
}

export interface IFoundPosts {
  data: FoundPost[];
  pagination: {
    next: string;
  };
}
