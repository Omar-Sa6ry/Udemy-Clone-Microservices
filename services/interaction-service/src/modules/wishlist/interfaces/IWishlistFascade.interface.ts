import { CourseIdInput } from 'src/modules/cart/dtos/courseId.input';
import { WishlistResponse } from '../dto/wishlistResponse.dto';

export interface IWishlistFascade {
  create(
    courseIdInput: CourseIdInput,
    userId: string,
  ): Promise<WishlistResponse>;
  delete(wishlistId: string): Promise<WishlistResponse>;
}
