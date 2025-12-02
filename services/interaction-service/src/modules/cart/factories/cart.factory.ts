import { Cart } from '../entities/cart.entity';

export class CartFactory {
  static create(userId: string): Cart {
    const cart = new Cart();
    cart.userId = userId;
    cart.totalPrice = 0;
    cart.cartItems = [];
    return cart;
  }
}
