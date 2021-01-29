import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TableService } from './table.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IUserRequestJwt } from '../constants/user';

@ApiTags('table')
@Controller('v1/table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Table data successfully returned.',
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
  @Get()
  async getTableData(
    @Request() req: { user: IUserRequestJwt },
    @Query('start', ParseIntPipe) start: number,
  ): Promise<any> {
    return await this.tableService.getPostsForTable(req.user.uuid, start);
  }
}
