import {
  UserCountResponse,
  UserResponse,
  UsersResponse,
} from '../dtos/UserResponse.dto';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { RedisService } from '@bts-soft/core';
import { Limit, Page, Role } from '@course-plateform/common';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UserProxy {
  constructor(
    private readonly i18n: I18nService,
    private readonly redisService: RedisService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<UserResponse> {
    const cacheKey = `user:${id}`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) return { data: cachedUser as User };

    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException(await this.i18n.t('user.NOT_FOUND'));

    this.redisService.set(cacheKey, user);
    this.redisService.set(`user:email:${user.email}`, user);

    return { data: user };
  }

  async findByEmail(email: string): Promise<UserResponse> {
    const cacheKey = `user:email:${email}`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) return { data: cachedUser as User };

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException(await this.i18n.t('user.NOT_FOUND'));

    this.redisService.set(cacheKey, user);
    this.redisService.set(`user:id:${user.id}`, user);

    return { data: user };
  }

  async findUsers(
    page: number = Page,
    limit: number = Limit,
  ): Promise<UsersResponse> {
    const [items, total] = await this.userRepo.findAndCount({
      where: { role: Role.USER },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    if (items.length === 0)
      throw new NotFoundException(await this.i18n.t('user.NOT_FOUNDS'));

    return {
      items,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findInstructors(
    page: number = Page,
    limit: number = Limit,
  ): Promise<UsersResponse> {
    const [items, total] = await this.userRepo.findAndCount({
      where: { role: Role.INSTRUCTOR },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    if (items.length === 0)
      throw new NotFoundException(await this.i18n.t('user.NOT_FOUNDS'));

    return {
      items,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // counts
  async getUsersCount(): Promise<UserCountResponse> {
    const cacheKey = `user-count`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) return { data: cachedUser };

    const count = {
      data: await this.userRepo.count({ where: { role: Role.USER } }),
    };

    this.redisService.setForEever(cacheKey, count.data);
    return count;
  }

  async getInstructorsCout(): Promise<UserCountResponse> {
    const cacheKey = `instructor-count`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser) return { data: cachedUser };

    const count = {
      data: await this.userRepo.countBy({ role: Role.INSTRUCTOR }),
    };

    this.redisService.setForEever(cacheKey, count.data);
    return count;
  }

  // For Anthor Serices
  async checkIfInstractor(id: string): Promise<Boolean> {
    const user = (await this.findById(id))?.data;

    if (user.role !== Role.INSTRUCTOR)
      throw new BadRequestException(await this.i18n.t('user.NOT_INSTRACTOR'));

    return true;
  }

  async phonenumberChecks(phone?: string, whatsapp?: string) {
    if (phone) {
      const phoneExised = await this.userRepo.findOne({ where: { phone } });
      if (phoneExised)
        throw new BadRequestException(await this.i18n.t('user.PHONE_EXISTED'));
    }

    if (whatsapp) {
      const whatsappExised = await this.userRepo.findOne({
        where: { whatsapp },
      });
      if (whatsappExised)
        throw new BadRequestException(
          await this.i18n.t('user.WHTSAPP_EXISTED'),
        );
    }
  }

  async dataExisted(
    email: string,
    phone: string,
    whatsapp: string,
  ): Promise<{ exists: boolean; message: string }> {
    const cacheKey = `user:email:${email}`;
    const cachedUser = await this.redisService.get(cacheKey);

    if (cachedUser)
      return { exists: true, message: await this.i18n.t('user.EMAIL_EXISTED') };

    const [emailExised, phoneExised, whatsappExised] = await Promise.all([
      this.userRepo.findOne({ where: { email } }),
      this.userRepo.findOne({ where: { phone } }),
      this.userRepo.findOne({ where: { whatsapp } }),
    ]);

    if (emailExised)
      return { exists: true, message: await this.i18n.t('user.EMAIL_EXISTED') };
    if (phoneExised)
      return { exists: true, message: await this.i18n.t('user.PHONE_EXISTED') };
    if (whatsappExised)
      return {
        exists: true,
        message: await this.i18n.t('user.WHTSAPP_EXISTED'),
      };

    return { exists: false, message: 'Not existed' };
  }
}
