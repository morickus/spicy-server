import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiOkResponsePaginate } from '../common/decorator/api-ok-response-paginate.decorator';
import { ApiPaginationQuery } from '../common/decorator/api-pagination-query.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiPaginationQuery()
  @ApiOkResponsePaginate(UserResponseDto)
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.getAllUsers(pagination);
  }
}
