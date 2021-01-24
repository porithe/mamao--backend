import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, Length } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({
    default: 'my comment',
  })
  @Length(1, 80)
  text: string;
  @ApiProperty({
    default: '',
  })
  @IsUUID('4')
  postUuid: string;
}

export class FindCommentsDto {
  @ApiProperty({
    default: '',
  })
  @IsUUID('4')
  postUuid: string;
}

export interface IAddedComment {
  uuid: string;
  createdAt: Date;
}
