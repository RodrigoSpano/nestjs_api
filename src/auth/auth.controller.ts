import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { loginDto } from './dto/login.dto';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { loginReturnDto } from './dto/login-return.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async singUp(@Body() data: createUserDto): Promise<User | HttpException> {
    if (!data.email || !data.password || !data.username)
      throw new HttpException('missing values', HttpStatus.BAD_REQUEST);
    const findUserExists = await this.userService.getUserForCreate({
      email: data.email,
      username: data.username,
    });
    if (findUserExists)
      throw new HttpException('user already exists', HttpStatus.CONFLICT);
    return this.userService.createUser(data);
  }

  @Post('/login')
  async login(@Body() data: loginDto): Promise<loginReturnDto | HttpException> {
    if (!data.email || !data.password)
      throw new HttpException('missing values', HttpStatus.BAD_REQUEST);
    const loginData = this.authService.login(data);
    if (!(await loginData).token)
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    return loginData;
  }
}
