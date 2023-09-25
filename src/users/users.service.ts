import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { userCreateFindDto } from './dto/user-create-find.dto';
import { loginDto } from 'src/auth/dto/login.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(data: createUserDto): Promise<User> {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['post'],
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserForCreate(data: userCreateFindDto): Promise<User> {
    const findByEmail = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (findByEmail) return findByEmail;
    const findByUsername = await this.userRepository.findOne({
      where: { username: data.username },
    });
    if (findByUsername) return findByUsername;
  }

  async updateUser(id: number, data: updateUserDto): Promise<User> {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (data.password) {
      data.password = await hash(data.password, 10);
    }
    const newUser = Object.assign(findUser, data);
    const updatedUser = await this.userRepository.save(newUser);
    return updatedUser;
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete({ id });
  }
}
