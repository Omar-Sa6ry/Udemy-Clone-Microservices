import { FindWishlistInput } from '../inputs/findWishlist.input';
import {
  WishlistResponse,
  WishlistsResponse,
} from '../dto/wishlistResponse.dto';

export interface IWishlistProxy {
  findById(id: string): Promise<WishlistResponse>;
  findAllWithPagination(
    findWishlistInput: FindWishlistInput,
  ): Promise<WishlistsResponse>;
  findAll(
    findWishlistInput: FindWishlistInput,
    page?: number,
    limit?: number,
  ): Promise<WishlistsResponse>;
}
