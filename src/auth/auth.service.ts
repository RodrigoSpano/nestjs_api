import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { loginReturnDto } from './dto/login-return.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(data: loginDto): Promise<loginReturnDto> {
    const findUser = await this.userService.getUserByEmail(data.email);
    if (findUser) {
      const isMatch = await findUser.comparePassword(data.password);
      if (isMatch) {
        const token = this.jwtService.sign(
          {
            id: findUser.id,
            email: findUser.email,
          },
          { secret: process.env.JWT_SECRET },
        );
        return {
          user: findUser,
          token,
        };
      }
    }
  }
}
