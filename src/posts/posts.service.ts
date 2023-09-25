import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { createPostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async createPost(data: createPostDto): Promise<Post> {
    const newPost = this.postsRepository.create(data);
    return await this.postsRepository.save(newPost);
  }

  async getPosts(): Promise<Post[]> {
    return await this.postsRepository.find({ relations: ['author'] });
  }

  async getPost(id: string): Promise<Post> {
    return await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async getUserPosts(authorId: number): Promise<Post[]> {
    return await this.postsRepository.find({
      where: { authorId },
      relations: ['author'],
    });
  }

  async deletePost(id: string) {
    return await this.postsRepository.delete({ id });
  }
}
