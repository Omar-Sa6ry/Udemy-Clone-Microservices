import { I18nService } from 'nestjs-i18n';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IWishlistHandler } from '../interfaces/IWishlistHandler.interface';
import { Wishlist } from '../entity/wishlist.entity';

export class WishlistExistsHandler implements IWishlistHandler {
  private nextHandler: IWishlistHandler;

  constructor(private readonly id: string) {}

  setNext(handler: IWishlistHandler): IWishlistHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(Wishlist: Wishlist | null, i18n: I18nService): Promise<void> {
    if (!Wishlist) {
      throw new NotFoundException(
        await i18n.t('Wishlist.NOT_FOUND', { args: { id: this.id } }),
      );
    }

    if (this.nextHandler) {
      await this.nextHandler.handle(Wishlist, i18n);
    }
  }
}

export class WishlistUniqueHandler implements IWishlistHandler {
  private nextHandler: IWishlistHandler;

  constructor(
    private readonly userId: string,
    private readonly courseId: string,
    private readonly repository: Repository<Wishlist>,
  ) {}

  setNext(handler: IWishlistHandler): IWishlistHandler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(_: Wishlist | null, i18n: I18nService): Promise<void> {
    const existing = await this.repository.findOneBy({
      userId: this.userId,
      courseId: this.courseId,
    });

    if (existing) {
      throw new BadRequestException(
        await i18n.t('wishlist.ALREADY_EXISTS', {
          args: { userId: this.userId, courseId: this.courseId },
        }),
      );
    }

    if (this.nextHandler) {
      await this.nextHandler.handle(null, i18n);
    }
  }
}
