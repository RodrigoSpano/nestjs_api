import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from './community.entity';
import { Repository } from 'typeorm';
import { createCommunityDto } from './dto/create-community.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
  ) {}

  async createCommunity(data: createCommunityDto): Promise<Community> {
    const newCommunity = this.communityRepository.create(data);
    return await this.communityRepository.save(newCommunity);
  }

  async getCommunityByName(name: string): Promise<Community> {
    return this.communityRepository.findOne({
      where: { name },
      relations: ['members'],
    });
  }

  async getCommunityById(id: number): Promise<Community> {
    return this.communityRepository.findOne({
      where: { id },
      relations: ['members'],
    });
  }

  async getCommunities(): Promise<Community[]> {
    return this.communityRepository.find({ relations: ['members'] });
  }

  async updateDescription(id: number, desc: string): Promise<Community> {
    const findCommunity = await this.getCommunityById(id);
    const newCommunity = Object.assign(findCommunity, { description: desc });
    const updatedCommunity = await this.communityRepository.save(newCommunity);
    return updatedCommunity;
  }

  async deleteCommunity(id: number) {
    return await this.communityRepository.delete({ id });
  }
}
