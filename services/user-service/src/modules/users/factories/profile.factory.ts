import { Injectable } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { UpdateProfileInput } from '../inputs/UpdateProfile.dto';

@Injectable()
export class ProfileFactory {
  static update(
    profile: Profile,
    updateProfileDto: UpdateProfileInput,
    newAvatarPath?: string,
  ): Profile {
    Object.assign(profile, updateProfileDto);
    if (newAvatarPath) profile.avatar = newAvatarPath;

    return profile;
  }
}
