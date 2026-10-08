import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // POST /api/v1/users
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // GET /api/v1/users
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // GET /api/v1/users/:id
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}