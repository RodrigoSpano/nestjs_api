import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './community.entity';
import { CommunityController } from './community.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Community]), UsersModule],
  providers: [CommunityService, JwtStrategy],
  controllers: [CommunityController],
})
export class ComunityModule {}
