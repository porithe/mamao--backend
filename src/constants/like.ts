import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LikePostDto {
  @ApiProperty({
    default: '',
  })
  @IsUUID('4')
  postUuid: string;
}
