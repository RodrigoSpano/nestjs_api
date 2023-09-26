import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ComunityModule } from './community/community.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: 'nestjsdb',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    ComunityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
