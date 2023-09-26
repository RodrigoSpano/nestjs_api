import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { createCommunityDto } from './dto/create-community.dto';
import { Community } from './community.entity';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('community')
export class CommunityController {
  constructor(
    private communityService: CommunityService,
    private userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createCommunity(
    @Body() data: createCommunityDto,
  ): Promise<Community | HttpException> {
    if (!data.name || !data.ownerId)
      throw new HttpException(
        'missing values, must be a name and an owner',
        HttpStatus.BAD_REQUEST,
      );
    const findUser = await this.userService.getUser(data.ownerId);
    if (!findUser)
      throw new HttpException('owner not found', HttpStatus.BAD_REQUEST);
    const findCommunity = await this.communityService.getCommunityByName(
      data.name,
    );
    if (findCommunity)
      throw new HttpException(
        'community name already taken',
        HttpStatus.CONFLICT,
      );
    return await this.communityService.createCommunity(data);
  }

  @Get()
  async getCommunities(): Promise<Community[]> {
    return this.communityService.getCommunities();
  }

  @Get(':name')
  async getCommunityByName(
    @Param('name') name: string,
  ): Promise<Community | HttpException> {
    if (!name)
      throw new HttpException('name is required', HttpStatus.BAD_REQUEST);
    const findCommunity = await this.communityService.getCommunityByName(name);
    if (!findCommunity)
      throw new HttpException('community not found', HttpStatus.NOT_FOUND);
    return findCommunity;
  }

  @Get(':id')
  async getCommunityById(
    @Param('id') id: number,
  ): Promise<Community | HttpException> {
    if (!id) throw new HttpException('id is required', HttpStatus.BAD_REQUEST);
    const findCommunity = await this.communityService.getCommunityById(id);
    if (!findCommunity)
      throw new HttpException('community not found', HttpStatus.NOT_FOUND);
    return findCommunity;
  }

  @Patch(':id')
  async updateDescription(
    @Param('id') id: number,
    @Body() data: string,
  ): Promise<Community | HttpException> {
    if (!id || !data)
      throw new HttpException(
        'id/description is required',
        HttpStatus.BAD_REQUEST,
      );
    const findCommunity = await this.communityService.getCommunityById(id);
    if (!findCommunity)
      throw new HttpException('community not found', HttpStatus.NOT_FOUND);
    return await this.communityService.updateDescription(id, data);
  }

  @Delete(':id')
  async deleteCommunity(
    @Param('id') id: number,
  ): Promise<{ deleted: true } | HttpException> {
    if (!id) throw new HttpException('id is required', HttpStatus.BAD_REQUEST);
    const deleteComm = await this.communityService.deleteCommunity(id);
    if (deleteComm.affected === 0)
      throw new HttpException('community not found', HttpStatus.NOT_FOUND);
    return { deleted: true };
  }
}
