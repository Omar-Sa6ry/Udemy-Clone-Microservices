import { I18nService } from 'nestjs-i18n';
import { Wishlist } from '../entity/wishlist.entity';

export interface IWishlistHandler {
  setNext(handler: IWishlistHandler): IWishlistHandler;
  handle(wishlist: Wishlist | null, i18n: I18nService): Promise<void>;
}
