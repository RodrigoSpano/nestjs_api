import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { createPostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './post.entity';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createPost(
    @Body() data: createPostDto,
  ): Promise<PostEntity | HttpException> {
    const findUser = await this.usersService.getUser(data.authorId);
    if (!findUser)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return this.postsService.createPost(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosts(): Promise<PostEntity[]> {
    return this.postsService.getPosts();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostEntity | HttpException> {
    const findPost = await this.postsService.getPost(id);
    if (!findPost)
      throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    return findPost;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':authorId')
  async getUserPosts(
    @Param('authorId') authorId: number,
  ): Promise<PostEntity[] | HttpException> {
    return await this.postsService.getUserPosts(authorId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    const postDeleted = await this.postsService.deletePost(id);
    if (postDeleted.affected === 0)
      throw new HttpException('post not found', HttpStatus.NOT_FOUND);
  }
}
