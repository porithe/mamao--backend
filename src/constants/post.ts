import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddPostDto {
  @ApiProperty({
    default: 'My example post',
  })
  @Length(1, 140)
  text: string;
}

export interface IProfilePost {
  uuid: string;
  text: string;
  createdAt: Date;
}

export interface IAddedPost {
  uuid: string;
  createdAt: Date;
}
