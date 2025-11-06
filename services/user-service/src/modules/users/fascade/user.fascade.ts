import { Transactional } from 'typeorm-transactional';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserResponse } from '../dtos/UserResponse.dto';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProxy } from '../proxy/user.proxy';
import { CacheObserver } from '../observer/user.observer';
import { UserRoleContext } from '../state/user.state';
import { CreateImageDto, RedisService, UploadService } from '@bts-soft/core';
import { UpdateUserInput } from '../inputs/UpdateUser.dto';
import { UpdateProfileInput } from '../inputs/UpdateProfile.dto';
import { ProfileFactory } from '../factories/profile.factory';
import { UserFactory } from '../factories/user.factory';
import { Profile } from '../entities/profile.entity';
import { ProfileResponse } from '../dtos/ProfileResponse.dto';
import { Role } from '@course-plateform/common';
import { CreateUserInput } from '../inputs/CreateUser.dto';
import { CreateProfileInput } from '../inputs/CreateProfile.dto';

@Injectable()
export class UserFacadeService {
  private observers: CacheObserver;

  constructor(
    private readonly i18n: I18nService,
    private readonly proxy: UserProxy,
    private readonly redisService: RedisService,
    private readonly uploadService: UploadService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {
    this.observers = new CacheObserver(this.redisService);
  }

  @Transactional()
  async create(
    createUserInput: CreateUserInput,
    createProfileInput: CreateProfileInput,
  ): Promise<UserResponse> {
    const user = await this.userRepo.create(createUserInput);
    await this.userRepo.save(user);

    let avatar = null;
    if (createProfileInput.avatar)
      avatar = await this.handleAvatarUpload(createProfileInput.avatar);

    const profile = await this.profileRepo.create({
      ...createProfileInput,
      avatar,
      user,
    });

    await this.profileRepo.save(profile);

    return { data: user };
  }

  @Transactional()
  async updateUser(
    updateUserDto: UpdateUserInput,
    id: string,
  ): Promise<UserResponse> {
    const user = (await this.proxy.findById(id))?.data;

    if (updateUserDto.phone)
      await this.proxy.phonenumberChecks(
        updateUserDto.phone,
        updateUserDto.whatsapp,
      );

    UserFactory.update(user, updateUserDto);

    await this.userRepo.save(user);
    await this.notifyUpdate(user);

    return { data: user };
  }

  @Transactional()
  async updateProfile(
    updateProfileInput: UpdateProfileInput,
    userId: string,
  ): Promise<ProfileResponse> {
    const user = (await this.proxy.findById(userId))?.data;
    const profile = user.profile;

    if (updateProfileInput.avatar) {
      const oldPath = profile.avatar;
      const filename = await this.uploadService.uploadImage(
        updateProfileInput.avatar,
      );

      if (typeof filename === 'string') {
        await this.uploadService.deleteImage(oldPath);
        ProfileFactory.update(profile, updateProfileInput, filename);
      } else {
        ProfileFactory.update(profile, updateProfileInput);
      }
    } else {
      ProfileFactory.update(profile, updateProfileInput);
    }

    await this.profileRepo.save(profile);

    return { data: profile };
  }

  @Transactional()
  async deleteUser(id: string): Promise<UserResponse> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user)
      throw new BadRequestException(await this.i18n.t('user.NOT_FOUND'));

    if (user.profile.avatar)
      await this.uploadService.deleteImage(user.profile.avatar);
    await this.userRepo.remove(user);
    await this.notifyDelete(user.id, user.email);

    return { message: await this.i18n.t('user.DELETED'), data: null };
  }

  @Transactional()
  async editUserRole(id: string): Promise<UserResponse> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user)
      throw new BadRequestException(await this.i18n.t('user.NOT_FOUND'));

    const roleContext = new UserRoleContext(user);
    await roleContext.promote(user);
    await this.userRepo.save(user);
    await this.notifyUpdate(user);

    return { data: user, message: await this.i18n.t('user.UPDATED') };
  }

  @Transactional()
  async createInstructor(userId: string): Promise<UserResponse> {
    const user = (await this.proxy.findById(userId))?.data;

    if (user.role !== Role.USER)
      throw new BadRequestException(await this.i18n.t('user.NOT_USER'));

    await this.userRepo.update({ id: userId }, { role: Role.INSTRUCTOR });

    const cachedUser = await this.redisService.get(`unactive-instructor-count`);
    if (cachedUser)
      this.redisService.set(`unactive-instructor-count`, +cachedUser + 1);

    return { data: user };
  }

  @Transactional()
  async saveRole(role: Role, userId: string): Promise<UserResponse> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user)
      throw new BadRequestException(await this.i18n.t('user.NOT_FOUND'));

    user.role = role;
    await this.userRepo.save(user);
    await this.notifyUpdate(user);

    return { data: user };
  }

  private async notifyUpdate(user: User): Promise<void> {
    await this.observers.onUserUpdate(user);
  }

  private async notifyDelete(userId: string, email: string): Promise<void> {
    await this.observers.onUserDelete(userId, email);
  }

  private async handleAvatarUpload(avatar: CreateImageDto): Promise<string> {
    const filename = await this.uploadService.uploadImage(avatar);
    return typeof filename === 'string' ? filename : '';
  }
}
