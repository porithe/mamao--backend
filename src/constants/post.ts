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

export interface IFoundPost {
  uuid: string;
  createdAt: Date;
  text: string;
  commentCount?: number;
}

export interface IFoundPostWithAuthor {
  author?: {
    username: string;
    avatar: string;
  };
  uuid: string;
  createdAt: Date;
  text: string;
  commentCount?: number;
  likeCount?: number;
  isLiked?: boolean;
}

export interface IFoundPostsWithAuthor {
  data: IFoundPostWithAuthor[];
  paginationNumber: number | null;
}

export interface IFoundPosts {
  data: IFoundPost[];
  paginationNumber: number | null;
}
