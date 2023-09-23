import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  createUser(@Body() data: createUserDto) {
    return this.userService.createUser(data);
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() data: updateUserDto) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
