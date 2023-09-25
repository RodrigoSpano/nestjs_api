import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUser(@Body() data: createUserDto): Promise<User | HttpException> {
    const findUser = await this.userService.getUserForCreate({
      email: data.email,
      username: data.username,
    });
    if (findUser)
      throw new HttpException('user already exists', HttpStatus.CONFLICT);
    return this.userService.createUser(data);
  }

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | HttpException> {
    const findUser = await this.userService.getUser(id);
    if (!findUser)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return this.userService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() data: updateUserDto,
  ): Promise<User> {
    const findUser = await this.userService.getUser(id);
    if (!findUser)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return this.userService.updateUser(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const findUser = await this.userService.getUser(id);
    if (!findUser)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return this.userService.deleteUser(id);
  }
}
