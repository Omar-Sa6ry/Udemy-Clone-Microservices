import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Profile } from '../entities/profile.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserProfileLoader {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  public readonly batchProfiles = new DataLoader<string, Profile>(
    async (userIds: string[]) => {
      const profiles = await this.profileRepo.find({
        where: { user: { id: In(userIds) } },
      });

      const profileMap = new Map(profiles.map((p) => [p.user.id, p]));
      return userIds.map((id) => profileMap.get(id) || null);
    },
  );
}
