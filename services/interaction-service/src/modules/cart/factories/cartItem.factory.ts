import { CartItem } from '../entities/cartItem.enitty';

export class CartItemFactory {
  static create(cartId: string, courseId: string, price: number): CartItem {
    const item = new CartItem();
    item.cartId = cartId;
    item.courseId = courseId;
    item.totalPrice = price;
    return item;
  }
}
