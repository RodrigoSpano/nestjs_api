import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersModule } from 'src/users/users.module';
import { PostsController } from './posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule],
  providers: [PostsService, JwtStrategy],
  controllers: [PostsController],
})
export class PostsModule {}
