import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Wishlist } from '../entity/wishlist.entity';
import { IWishlistProxy } from '../interfaces/IWishlistProxy.interface';
import { WishlistExistsHandler } from '../chain/wishlist.chain';
import { FindWishlistInput } from '../inputs/findWishlist.input';
import {
  WishlistResponse,
  WishlistsResponse,
} from '../dto/wishlistResponse.dto';
import { Limit, Page } from '@course-plateform/common';
import { CoursesResponse } from '@course-plateform/types';

@Injectable()
export class WishlistProxy implements IWishlistProxy {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async findById(id: string): Promise<WishlistResponse> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });

    const existsHandler = new WishlistExistsHandler(id);
    await existsHandler.handle(wishlist, this.i18n);

    return { data: wishlist };
  }

  async findAllWithPagination(
    findWishlistInput: FindWishlistInput,
  ): Promise<WishlistsResponse> {
    const items = await this.wishlistRepository.find({
      where: findWishlistInput,
      order: { createdAt: 'DESC' },
    });

    if (items.length === 0)
      throw new NotFoundException(await this.i18n.t('wishlist.NOT_FOUNDS'));

    return {
      items,
    };
  }

  async findAll(
    findWishlistInput: FindWishlistInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<WishlistsResponse> {
    const [items, total] = await this.wishlistRepository.findAndCount({
      where: findWishlistInput,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (items.length === 0)
      throw new NotFoundException(await this.i18n.t('wishlist.NOT_FOUNDS'));

    return {
      items,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkIfInWishlist(userId: string, courseId: string): Promise<void> {
    const checkIfInWishlist = await this.wishlistRepository.findOne({
      where: { userId, courseId },
    });
    if (checkIfInWishlist) {
      this.wishlistRepository.remove(checkIfInWishlist);
      this.wishlistRepository.save(Wishlist);
    }
  }
}
