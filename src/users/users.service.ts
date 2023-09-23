import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(data: createUserDto): Promise<User | HttpException> {
    if (!data.email || !data.password || !data.username)
      throw new HttpException('Missing values', HttpStatus.BAD_REQUEST);
    const findUserByEmail = await this.userRepository.findOne({
      where: { email: data.email },
    });
    const findUserByUsername = await this.userRepository.findOne({
      where: { username: data.username },
    });
    if (findUserByEmail || findUserByUsername)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    const newUser = this.userRepository.create({
      email: data.email,
      password: data.password,
      username: data.username,
    });
    return await this.userRepository.save(newUser);
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(id: number): Promise<User | HttpException> {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return findUser;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUser(
    id: number,
    data: updateUserDto,
  ): Promise<User | HttpException> {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const newUser = Object.assign(findUser, data);
    const updatedUser = await this.userRepository.save(newUser);
    return updatedUser;
  }

  async deleteUser(id: number) {
    const deleteUser = await this.userRepository.delete({ id });
    if (deleteUser.affected === 0)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return deleteUser;
  }
}
